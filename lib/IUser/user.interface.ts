import { Gender, AuthProvider, Role } from "src/common/enums/user.enum";
import { HOtpDoc } from "src/DB/models/otp.model";


export interface IUser {
  firstName: string;

  lastName: string;

  email: string;

  phone?: string;

  gender?: Gender;

  age?: number;

  profileImage?: string;

  password: string;

  provider: AuthProvider;

  providerId?: string;

  isEmailConfirmed?: Date;

  isActive: boolean;

  role: Role;

  isDeleted: boolean;

  otp?: HOtpDoc[];
}