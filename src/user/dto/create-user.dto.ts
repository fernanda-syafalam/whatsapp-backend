import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';

type Role = 'admin' | 'user';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  role: string;

  @IsNotEmpty()
  @IsString()
  // @Matches(
  //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{12,20}$/,
  //   {
  //     message:
  //       'Password must be at least 8 characters, contain at least one lowercase letter, one uppercase letter, one number, and one special character.',
  //   },
  // )
  password: string;
}
