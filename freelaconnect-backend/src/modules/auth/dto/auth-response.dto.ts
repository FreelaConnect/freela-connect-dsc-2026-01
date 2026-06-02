import { UserResponseDto } from '../../users/dto/user-response.dto';

export class AuthResponseDto {
  accessToken: string;
  user: UserResponseDto;

  constructor(data: { accessToken: string; user: UserResponseDto }) {
    this.accessToken = data.accessToken;
    this.user = data.user;
  }
}
