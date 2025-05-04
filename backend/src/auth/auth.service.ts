import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as auth0 from 'auth0-js';
import { firstValueFrom } from 'rxjs';
import { AxiosError, AxiosResponse } from 'axios';
import { HttpService } from '@nestjs/axios';
import { UsersService } from 'src/users/users.service';
import { AuthCallbackResponse, TokenResponse, UserAuthState, userTypes, UserInfo } from 'src/Types/user.types';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private auth0Client: auth0.WebAuth;
  private managementApiToken: string | null = null;
  private tokenExpirationTime: number = 0;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly usersService: UsersService,
  ) {
    this.auth0Client = new auth0.WebAuth({
      domain: this.configService.get<string>('AUTH0_DOMAIN'),
      clientID: this.configService.get<string>('AUTH0_CLIENT_ID'),
      responseType: 'code',
      scope: 'openid profile email',
    });
  }

  getLoginUrl(): string {
    const domain = this.configService.get<string>('AUTH0_DOMAIN');
    const clientId = this.configService.get<string>('AUTH0_CLIENT_ID');
    const redirectUri = this.configService.get<string>('AUTH0_CALLBACK_URL');
    const responseType = 'code';
    const scope = 'openid profile email';

    const url = new URL(`https://${domain}/authorize`);
    url.searchParams.append('client_id', clientId);
    url.searchParams.append('redirect_uri', redirectUri);
    url.searchParams.append('response_type', responseType);
    url.searchParams.append('scope', scope);

    return url.toString();
  }

  async handleCallback(code: string): Promise<{ redirectUrl: string; data: AuthCallbackResponse | User | { message: string } }> {
    const tokenEndpoint = `https://${this.configService.get<string>('AUTH0_DOMAIN')}/oauth/token`;
    const payload = {
      grant_type: 'authorization_code',
      client_id: this.configService.get<string>('AUTH0_CLIENT_ID'),
      client_secret: this.configService.get<string>('AUTH0_CLIENT_SECRET'),
      code,
      redirect_uri: this.configService.get<string>('AUTH0_CALLBACK_URL'),
    };

    try {
      const tokenResponse: AxiosResponse<TokenResponse> = await firstValueFrom(this.httpService.post<TokenResponse>(tokenEndpoint, payload));

      const { access_token, id_token, refresh_token } = tokenResponse.data;

      const userInfoEndpoint = `https://${this.configService.get<string>('AUTH0_DOMAIN')}/userinfo`;
      const userInfoResponse: AxiosResponse<UserInfo> = await firstValueFrom(
        this.httpService.get<UserInfo>(userInfoEndpoint, {
          headers: { Authorization: `Bearer ${access_token}` },
        }),
      );

      const userInfo = userInfoResponse.data;
      let frontendUrl = this.configService.get<string>('FRONTEND_URL');

      const user = await this.usersService.findOne({ email: userInfo.email });

      if (user && userInfo.email_verified) {
        if (user.authState === UserAuthState.UNVERIFIED) {
          user.authState = UserAuthState.VERIFIED;
          user.loginEnabled = true;
          await this.usersService.update(user._id.toString(), user);
        }
        const data = {
          user,
          access_token,
          id_token,
          refresh_token,
          email_verified: userInfo.email_verified,
        };
        if (user.type.includes(userTypes.ADMIN)) {
          // replace the frontend url with the admin frontend url
          frontendUrl = frontendUrl.replace('store', 'admin');
        }
        return {
          redirectUrl: `${frontendUrl}/auth/success`,
          data,
        };
      } else if (!userInfo.email_verified && user) {
        try {
          await this.sendVerificationEmail(userInfo.sub);
          if (user.type.includes(userTypes.ADMIN)) {
            frontendUrl = frontendUrl.replace('store', 'admin');
          }
          return {
            redirectUrl: `${frontendUrl}/auth/verify-email`,
            data: { message: 'Email not verified. A new verification email has been sent' },
          };
        } catch (error) {
          if (error instanceof InternalServerErrorException && error.message.includes('access_denied')) {
            this.logger.error('Application does not have permission to send verification emails');
            if (user.type.includes(userTypes.ADMIN)) {
              frontendUrl = frontendUrl.replace('admin', 'store');
            }
            return {
              redirectUrl: `${frontendUrl}/auth/error`,
              data: { message: 'Email not verified. Unable to send verification email due to configuration issue. Please contact support.' },
            };
          }
          this.logger.error(`Failed to send verification email: ${error.message}`);
          if (user.type.includes(userTypes.ADMIN)) {
            frontendUrl = frontendUrl.replace('admin', 'store');
          }
          return {
            redirectUrl: `${frontendUrl}/auth/error`,
            data: { message: 'Email not verified. Failed to send verification email. Please try again later or contact support.' },
          };
        }
      } else {
        const [firstName, ...lastNameParts] = userInfo.name.split(' ');
        const lastName = lastNameParts.length > 0 ? lastNameParts.join(' ') : firstName;
        const authState = userInfo.email_verified ? UserAuthState.VERIFIED : UserAuthState.UNVERIFIED;
        const loginEnabled = userInfo.email_verified;

        const newUser = await this.usersService.create({
          email: userInfo.email,
          firstName,
          lastName,
          avatar: userInfo.picture,
          authState,
          type: [userTypes.CLIENT],
          loginEnabled,
        });

        const data = {
          user: newUser,
          access_token,
          id_token,
          refresh_token,
          email_verified: userInfo.email_verified,
        };

        return {
          redirectUrl: `${frontendUrl}/auth/success`,
          data,
        };
      }
    } catch (error) {
      this.logger.error('Error in Auth0 callback:', error);
      return {
        redirectUrl: `${this.configService.get<string>('FRONTEND_URL')}/auth/error`,
        data: { message: 'Failed to authenticate with Auth0' },
      };
    }
  }

  private async getManagementApiToken(): Promise<string> {
    if (this.managementApiToken && Date.now() < this.tokenExpirationTime) {
      return this.managementApiToken;
    }

    const domain = this.configService.get<string>('AUTH0_DOMAIN');
    const clientId = this.configService.get<string>('AUTH0_CLIENT_ID');
    const clientSecret = this.configService.get<string>('AUTH0_CLIENT_SECRET');

    if (!domain || !clientId || !clientSecret) {
      throw new InternalServerErrorException('Missing Auth0 configuration');
    }

    const tokenEndpoint = `https://${domain}/oauth/token`;
    const payload = {
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
      audience: `https://${domain}/api/v2/`,
    };

    try {
      const response: AxiosResponse<{ access_token: string; expires_in: number }> = await firstValueFrom(this.httpService.post(tokenEndpoint, payload));

      this.managementApiToken = response.data.access_token;
      this.tokenExpirationTime = Date.now() + response.data.expires_in * 1000;

      return this.managementApiToken;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 403) {
        this.logger.error(`Failed to retrieve Management API token: ${error.message}`);
        this.logger.error(`Response data: ${JSON.stringify(error.response?.data)}`);
        throw new InternalServerErrorException('access_denied: Application does not have permission to access the Management API');
      } else {
        this.logger.error(`Failed to retrieve Management API token: ${error}`);
        throw new InternalServerErrorException('Failed to retrieve Management API token');
      }
    }
  }

  private async sendVerificationEmail(userId: string): Promise<void> {
    const domain = this.configService.get<string>('AUTH0_DOMAIN');
    const clientId = this.configService.get<string>('AUTH0_CLIENT_ID');

    if (!domain || !clientId) {
      throw new InternalServerErrorException('Missing Auth0 configuration');
    }

    const verificationEndpoint = `https://${domain}/api/v2/jobs/verification-email`;
    const payload = {
      client_id: clientId,
      user_id: userId,
    };

    try {
      const token = await this.getManagementApiToken();
      await firstValueFrom(
        this.httpService.post(verificationEndpoint, payload, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      );
      this.logger.log(`Verification email sent to user: ${userId}`);
    } catch (error) {
      if (error instanceof AxiosError) {
        this.logger.error(`Failed to send verification email to user ${userId}: ${error.message}`);
        this.logger.error(`Response data: ${JSON.stringify(error.response?.data)}`);
      } else {
        this.logger.error(`Failed to send verification email to user ${userId}: ${error}`);
      }
      throw error;
    }
  }
}
