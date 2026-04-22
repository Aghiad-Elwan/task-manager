import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '../common/guards/auth/auth.guard';
import { RolesGuard } from '../common/guards/roles/roles.guard';
import { Roles } from '../common/decorators/roles/roles.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Protected: You must be logged in
  @Get()
  @UseGuards(AuthGuard)
  findAll() {
    return this.usersService.findAll();
  }

  // Protected: You must be logged in
  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  // Open to everyone - so anyone can create an account
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  // Protected + admin only
  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  // Protected + admin only
  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }
}
