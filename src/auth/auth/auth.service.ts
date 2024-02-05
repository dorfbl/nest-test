import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable, from, of } from 'rxjs';
const bcrypt = require('bcrypt');

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  generateJWT(user: Object): Observable<string> {
    return from(this.jwtService.signAsync({ user }));
  }

  hashPassword(password: string): Observable<string> {
    return from<string>(bcrypt.hashPassword(password, 12));
  }

  comparePasswords(
    newPassword: string,
    passwordHash: string,
  ): Observable<any | boolean> {
    return of<any | boolean>(
      bcrypt.comparePasswords(newPassword, passwordHash),
    );
  }
}
