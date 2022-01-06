import {
  Controller,
  Request,
  Response,
  Get,
  Post,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtRefreshGuard } from './jwt-refresh.guard';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req, @Response() res) {
    const { user } = req;
    const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(
      user.id,
    );
    const refreshToken = this.authService.getCookieWithJwtRefreshToken(user.id);
    await this.usersService.setCurrentRefreshToken(refreshToken.token, user.id);

    req.res.setHeader('Set-Cookie', [accessTokenCookie, refreshToken.cookie]);
    return res.send({
      id: user.id,
      username: user.username,
      isAdmin: user.isAdmin,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('logout')
  async logOut(@Request() req, @Response() res) {
    await this.usersService.removeRefreshToken(req.user.id);
    res.setHeader('Set-Cookie', this.authService.getCookiesForLogOut());
    return res.sendStatus(200);
  }

  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  refresh(@Request() req) {
    const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(
      req.user.id,
    );

    req.res.setHeader('Set-Cookie', accessTokenCookie);
    return 'Auth Token Refreshed';
  }

  /*
  @UseGuards(JwtAuthGuard)
  @Get('authenticate')
  authenticate(@Request() req) {
    const { user } = req;
    return res.send({ id: user.id, username: user.username, isAdmin: user.isAdmin });
  }*/
}
