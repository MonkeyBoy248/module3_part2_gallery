import { RequestUser } from "./auth.interface";
import { mongoConnectionService } from "@models/MongoDB/services/mongoConnection.service";
import { UserDBService } from "@models/MongoDB/services/userDB.service";
import { HashPasswordService } from "@services/hashPassword.service";
import { JwtService} from "@services/jwt.service";
import { AlreadyExistsError, HttpBadRequestError, HttpUnauthorizedError } from "@floteam/errors";

export class AuthService {
  private readonly dbUsersService;
  private readonly jwtService;
  private readonly hashService;


  constructor() {
    this.jwtService = new JwtService();
    this.dbUsersService = new UserDBService();
    this.hashService = new HashPasswordService();
  }

  validateUserData = (data: string) => {
    const userData = JSON.parse(data);

    if (!userData.email) {
      throw new HttpBadRequestError('No email was provided');
    }

    if (!userData.password) {
      throw new HttpBadRequestError('No password was provided')
    }

    const userObject: RequestUser = {
      email: userData.email,
      password: userData.password
    }

    return userObject;
  }

  signUp = async (userData: RequestUser) => {
    try {
      await mongoConnectionService.connectDB();

      const newUser = await this.dbUsersService.saveUsersToDB(userData);

      return {user: newUser, message: 'User successfully added'}
    } catch (err) {
      throw new AlreadyExistsError('User with this email already exists')
    }
  }

  logIn = async (userData: RequestUser) => {
    try {
      await mongoConnectionService.connectDB();

      const contender = await this.dbUsersService.findUserByEmail(userData.email);

      await this.hashService.comparePasswords(contender.password, contender.salt, userData.password);

      return this.jwtService.createToken(contender.email);
    } catch (err) {
      throw new HttpUnauthorizedError('Wrong user data');
    }
  }

  authenticate = async (token: string) => {
    try {
      await mongoConnectionService.connectDB();

      return this.jwtService.verifyToken(token);
    } catch (err) {
      throw new HttpUnauthorizedError('Invalid token');
    }
  }

  uploadDefaultUsers = async () => {
    try {
      await mongoConnectionService.connectDB();

      await this.dbUsersService.saveUsersToDB();

      return {message: 'Default users were successfully added'}
    } catch (err) {
      throw new HttpBadRequestError('Failed to upload users');
    }
  }
}