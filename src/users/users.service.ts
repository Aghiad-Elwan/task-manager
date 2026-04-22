import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './interfaces/user.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  private users: User[] = [];

  private idCounter = 1;

  findAll(): User[] {
    return this.users;
  }

  findOne(id: number): User {
    const user = this.users.find((u) => u.id === id);

    if (!user) {
      throw new NotFoundException(`المستخدم رقم ${id} ما موجود`);
    }

    return user;
  }

  create(createUserDto: CreateUserDto): User {
    const newUser: User = {
      id: this.idCounter++,
      name: createUserDto.name,
      email: createUserDto.email,
      role: createUserDto.role || 'user',
      createdAt: new Date(),
    };

    this.users.push(newUser);

    return newUser;
  }

  update(id: number, updateUserDto: UpdateUserDto): User {
    const userIndex = this.users.findIndex((u) => u.id === id);

    if (userIndex === -1) {
      throw new NotFoundException(`المستخدم رقم ${id} ما موجود`);
    }

    const currentUser = this.users[userIndex];

    // merge the new data with the old, filter undefined values.
    this.users[userIndex] = {
      ...currentUser,
      ...Object.fromEntries(
        Object.entries(updateUserDto).filter(([, v]) => v !== undefined),
      ),
    };

    return this.users[userIndex];
  }

  remove(id: number): { message: string } {
    const userIndex = this.users.findIndex((u) => u.id === id);

    if (userIndex === -1) {
      throw new NotFoundException(`المستخدم رقم ${id} ما موجود`);
    }

    this.users.splice(userIndex, 1);

    return { message: `تم حذف المستخدم رقم ${id} بنجاح` };
  }
}
