import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

interface AuthRequest extends Request {
  user?: { Id: number; roles: string[] };
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    @Inject(forwardRef(() => JwtService))
    private readonly jwtService: JwtService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AuthRequest>(); // Явно указываем тип
    const authHeader: string | undefined = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Некорректный заголовок Authorization');
    }

    const [, token] = authHeader.split(' ');

    try {
      const user = this.jwtService.verify<{ Id: number; roles: string[] }>(
        token,
        {
          secret: process.env.JWT_SECRET,
        },
      );

      request.user = user; // Теперь TypeScript понимает, что у request есть user
      return true;
    } catch (e) {
      if (e instanceof Error && e.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Токен истёк');
      } else {
        throw new UnauthorizedException('Неверный токен');
      }
    }
  }
}
