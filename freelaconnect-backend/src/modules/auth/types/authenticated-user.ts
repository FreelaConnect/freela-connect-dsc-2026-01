import { UserRole } from '../../users/enums/user-role.enum';

export type AuthenticatedUser = {
  userId: number;
  email: string;
  role: UserRole;
};
