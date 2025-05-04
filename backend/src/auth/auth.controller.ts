import { Controller, Get, UseGuards, Query, UnauthorizedException, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ClsService } from 'nestjs-cls';
import { AppClsStore, userTypes } from 'src/Types/user.types';
import { Response } from 'express';
import { Roles } from './roles.decorator';
import { RolesGuard } from './roles.guard';

@ApiTags('auth')
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly clsService: ClsService,
  ) {}

  @Get('login')
  @ApiOperation({ summary: 'Get Auth0 login URL' })
  @ApiResponse({ status: 200, description: 'Login URL retrieved successfully' })
  getLoginUrl(): { url: string } {
    const url = this.authService.getLoginUrl();
    return { url };
  }

  @Get('callback')
  @ApiOperation({ summary: 'Handle Auth0 callback' })
  @ApiResponse({ status: 200, description: 'Authentication successful' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async handleCallback(@Query('code') code: string, @Res() response: Response): Promise<void> {
    if (!code) {
      throw new UnauthorizedException('No authorization code provided');
    }

    const { redirectUrl, data } = await this.authService.handleCallback(code);

    // Encode the data as URL parameters
    const queryParams = new URLSearchParams();
    for (const [key, value] of Object.entries(data)) {
      if (typeof value === 'object') {
        queryParams.append(key, JSON.stringify(value));
      } else {
        queryParams.append(key, String(value));
      }
    }

    // Redirect to the frontend with the data as URL parameters
    response.redirect(`${redirectUrl}?${queryParams.toString()}`);
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(userTypes.ADMIN, userTypes.CLIENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({ status: 200, description: 'Profile retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getProfile() {
    const context = this.clsService.get<AppClsStore>();

    return context;
  }
}
