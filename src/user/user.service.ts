import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import {
  Observable,
  catchError,
  from,
  map,
  of,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { User, UserRole } from './user.interface';
import { AuthService } from 'src/auth/auth/auth.service';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';

interface LoginResponse {
  token: string;
  user: User;
}

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private authService: AuthService,
  ) {}

  create(user: User): Observable<any> {
    return this.authService.hashPassword(user.password).pipe(
      switchMap((passwordHash: string) => {
        const newUser = new UserEntity();
        newUser.eng_name = user.eng_name;
        newUser.username = user.username;
        newUser.email = user.email;
        newUser.heb_name = user.heb_name;
        newUser.eng_family = user.eng_family;
        newUser.former_eng_family = user.former_eng_family;
        newUser.former_family = user.former_family;
        newUser.phone = user.phone;
        newUser.gender = user.gender;
        newUser.map = user.map;
        newUser.birth_place = user.birth_place;
        newUser.birth_hospital = user.birth_hospital;
        newUser.dob = user.dob;
        newUser.blood = user.blood;
        newUser.avatar = user.avatar;
        newUser.heb_family = user.heb_family;
        newUser.id_nr = user.id_nr;
        newUser.password = passwordHash;
        newUser.login = UserRole.USER;
        console.log(newUser);
        return from(this.userRepository.save(newUser)).pipe(
          map((user: User) => {
            const { password, ...result } = user;
            return result;
          }),
          catchError((err) => throwError(err)),
        );
      }),
    );
  }

  findOne(id: string): Observable<User> {
    return from(
      this.userRepository.findOne({ where: { id: parseInt(id) } }),
    ).pipe(
      map((user: User) => {
        const { password, ...result } = user;
        return result;
      }),
    );
  }

  findAll(): Observable<User[]> {
    return from(this.userRepository.find()).pipe(
      map((users: User[]) => {
        users.forEach(function (v) {
          delete v.password;
        });
        return users;
      }),
    );
  }

  paginate(
    options: IPaginationOptions,
    orderBy?: string,
    sortOrder: 'ASC' | 'DESC' = 'ASC',
  ): Observable<Pagination<User>> {
    const queryBuilder = this.userRepository.createQueryBuilder('c');
    if (orderBy) {
      queryBuilder.orderBy(`c.${orderBy}`, sortOrder);
    }

    return from(paginate<User>(queryBuilder, options)).pipe(
      map((userPageable: Pagination<User>) => {
        userPageable.items.forEach(function (v) {
          delete v.password;
        });
        return userPageable;
      }),
    );
  }

  deleteOne(id: number): Observable<any> {
    return from(this.userRepository.delete(id));
  }

  updateOne(id: number, user: User): Observable<any> {
    delete user.email;
    delete user.password;
    // delete user.role;
    return from(this.userRepository.update(id, user));
  }

  login(user: User): Observable<LoginResponse> {
    return this.validateUser(user.email, user.password).pipe(
      switchMap((user: User) => {
        if (user) {
          return this.authService
            .generateJWT(user)
            .pipe(map((jwt: string) => ({ token: jwt, user: user })));
        } else {
          return of({ token: null, user: null });
        }
      }),
    );
  }

  validateUser(email: string, password: string): Observable<User> {
    return this.findByMail(email).pipe(
      switchMap((user: User) =>
        this.authService.comparePasswords(password, user.password).pipe(
          map((match: boolean) => {
            if (match) {
              const { password, ...result } = user;
              return result;
            } else {
              throw Error;
            }
          }),
        ),
      ),
    );
  }

  findByMail(email: string): Observable<User> {
    return from(this.userRepository.findOne({ where: { email: email } }));
  }

  updateRoleOfUser(id: number, user: User): Observable<any> {
    return from(this.userRepository.update(id, user));
  }
}
