import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { passportJwtSecret } from 'jwks-rsa';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';
import { ClsService } from 'nestjs-cls';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly cls: ClsService,
  ) {
    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://${configService.get<string>('AUTH0_DOMAIN')}/.well-known/jwks.json`,
      }),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      audience: configService.get<string>('AUTH0_AUDIENCE'),
      issuer: `https://${configService.get<string>('AUTH0_DOMAIN')}/`,
      algorithms: ['RS256'],
    });
  }

  async validate(payload: any): Promise<any> {
    if (!payload) {
      this.logger.warn('Invalid token received!');
      throw new UnauthorizedException('Invalid token');
    }

    const user = await this.usersService.findOne({ email: payload.email });
    if (!user) {
      this.logger.warn(`User not found for subject: ${payload.sub}`);
      throw new UnauthorizedException('User not found');
    }

    this.logger.log(`Token validated for subject: ${payload.sub}, email: ${user.email}, role: ${user.type}`);

    this.cls.set('user', user);

    return {
      userId: payload.sub,
      email: payload.email,
      role: user.type,
      avatar: user.avatar,
    };
  }
}
