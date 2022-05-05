import jwt from 'jsonwebtoken';

export class JwtService {
  private secretKey = process.env.SECRET_KEY || 'token';

  createToken = async (data: string) => {
    return jwt.sign({ email: data}, this.secretKey);
  }

  verifyToken = async (token: string) => {
    return jwt.verify(token, this.secretKey);
  }
}


