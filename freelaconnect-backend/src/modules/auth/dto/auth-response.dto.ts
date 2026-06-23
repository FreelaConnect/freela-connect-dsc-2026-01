import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from '../../users/dto/user-response.dto';

export class AuthResponseDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  accessToken: string;
  @ApiProperty({ type: UserResponseDto })
  user: UserResponseDto;

  constructor(data: { accessToken: string; user: UserResponseDto }) {
    this.accessToken = data.accessToken;
    this.user = data.user;
  }
}
