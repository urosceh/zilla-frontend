export interface IUserDto {
  userId: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
}

export type UserCreate = Omit<IUserDto, "userId">;
