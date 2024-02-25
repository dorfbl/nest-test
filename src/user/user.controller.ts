import { Pagination } from 'nestjs-typeorm-paginate';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Observable, map } from 'rxjs';
import { User, UserRole } from './user.interface';
import { hasRoles } from 'src/auth/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/auth/guards/roles.guard';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  create(@Body() user: User): Observable<User> {
    return this.userService.create(user);
  }

  @Post('login')
  login(@Body() user: User): Observable<{ token: string; user: User }> {
    return this.userService.login(user);
  }

  @Get(':id')
  findOne(@Param() params): Observable<any> {
    return this.userService.findOne(params.id);
  }

  @Get()
  // @hasRoles(UserRole.ADMIN)
  // @UseGuards(JwtAuthGuard, RolesGuard)
  index(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 30,
    @Query('orderBy') orderBy?: string,
    @Query('sortOrder') sortOrder: 'ASC' | 'DESC' = 'ASC',
  ): Observable<Pagination<User>> {
    limit = limit > 100 ? 100 : limit;
    return this.userService.paginate(
      {
        page: +page,
        limit: +limit,
        route: 'http://10.10.100.10:3000/users',
      },
      orderBy,
      sortOrder,
    );
  }

  @Delete(':id')
  deleteOne(@Param('id') id: Number): Observable<any> {
    return this.userService.deleteOne(Number(id));
  }

  @Put(':id')
  updateOne(@Param('id') id: string, @Body() user: User): Observable<any> {
    return this.userService.updateOne(Number(id), user);
  }

  @hasRoles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put(':id/role')
  updateRoleOfUser(
    @Param('id') id: string,
    @Body() user: User,
  ): Observable<User> {
    return this.userService.updateRoleOfUser(Number(id), user);
  }
}
