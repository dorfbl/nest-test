import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, map } from 'rxjs';
import { User } from 'src/user/user.interface';
import { UserService } from 'src/user/user.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
  ) {}

  canActivate(context: ExecutionContext): boolean | Observable<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());

    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user: User = request.user.user;
    return this.userService.findOne(String(user.id)).pipe(
      map((user: User) => {
        const hasRole = () => roles.indexOf(user.role) > -1;
        let hasPermissions = false;
        if (hasRole()) {
          hasPermissions = true;
        }
        return user && hasPermissions;
      }),
    );
  }
}
