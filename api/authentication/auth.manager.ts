import { AuthService } from "./auth.service";
import { HttpUnauthorizedError } from "@floteam/errors";

export class AuthManager {
  private readonly service: AuthService;

  constructor() {
    this.service = new AuthService();
  }

  signUp = async (data: string) => {
    const user = this.service.validateUserData(data);

    return this.service.signUp(user);
  }

  logIn = async (data: string) => {
    const user = this.service.validateUserData(data);

    return this.service.logIn(user);
  }

  uploadDefaultUsers = async () => {
    return this.service.uploadDefaultUsers();
  }

  authenticate = async (token: string) => {
    if (!token) {
      throw new HttpUnauthorizedError('No token was provided');
    }

    return this.service.authenticate(token);
  }
}
