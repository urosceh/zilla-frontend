export interface IUserDto {
  userId: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
}

export class User {
  public userId: string;
  public email: string;
  public firstName: string | null;
  public lastName: string | null;

  constructor(user: IUserDto) {
    if (!user || !user.userId || !user.email) {
      throw new Error("Invalid user");
    }

    this.userId = user.userId;
    this.email = user.email;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
  }
}
