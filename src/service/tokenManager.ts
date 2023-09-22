import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { USER_ROLES } from "../models/users";

require('dotenv').config();

export interface tokenPayLoad {
  id: string;
  name: string;
  role: USER_ROLES;
}

export class tokenManager {
  public createToken(payload: tokenPayLoad): string {
    console.log('Valor de process.env.JWT_KEY:', process.env.JWT_KEY);
  
    const token = jwt.sign(payload, process.env.JWT_KEY as string, {
      expiresIn: process.env.JWT_EXPIRES_IN
    });
    return token;
  }

  public getPayLoad(token: string): tokenPayLoad | null {
    try {
      const payload = jwt.verify(token, process.env.JWT_KEY as string);
      return payload as tokenPayLoad;
    } catch (error) {
      return null;
    }
  }
}
