import { userDatabase } from "../database/userDataBase";
import { LoginOutputDTO, loginInputDTO } from "../dtos/user/loogin.dto";
import { signupInputDTO, signupOutputDTO } from "../dtos/user/singup.dto";
import { badRequest } from "../error/badRquest";
import { USER_ROLES, User } from "../models/users";
import { HashManager } from "../service/hashManager";
import { idGenerator } from "../service/idGenerator";
import { tokenManager, tokenPayLoad } from "../service/tokenManager";

require('dotenv').config();

export class UserBusiness {
    constructor(
      private userDatabase: userDatabase,
      private idGenerator: idGenerator,
      private tokenManager: tokenManager,
      private hashManager : HashManager
    ) {}
    public signup = async (input: signupInputDTO): Promise<signupOutputDTO> => {
      const { name, email, password } = input;
  
      const userDBExists = await this.userDatabase.findUserByEmail(email);
  
      if (userDBExists) {
        throw new badRequest("'Email' já registrado");
      }
  
      const id = this.idGenerator.generatorId();
  
      const hashedPassword = await this.hashManager.hash(password);
  
      const newUser = new User(
        id,
        name,
        email,
        hashedPassword,
        USER_ROLES.NORMAL,
        new Date().toISOString()
      );
  
      const newUserDB = newUser.toDBModel();
      await this.userDatabase.addUser(newUserDB);
  
      const tokenPayload: tokenPayLoad = {
        id: newUser.getId(),
        name: newUser.getName(),
        role: newUser.getRole(),
      };
  
      const token = this.tokenManager.createToken(tokenPayload);
  
      const output:signupOutputDTO = {
        message: "Registro concluido com sucesso",
        token: token,
      };
  
      return output;
    };
  
    public login = async (input: loginInputDTO): Promise<LoginOutputDTO> => {
      const { email, password } = input;
  
      const userDB = await this.userDatabase.findUserByEmail(email);
  
      if (!userDB) {
        throw new badRequest('"email" não encontrado');
      }
  
      const passwordValid = await this.hashManager.compare(
        password,
        userDB.password
      );
  
      if (!passwordValid) {
        throw new badRequest('"Email" ou "Password" inválido')
      }
  
      const user = new User(
        userDB.id,
        userDB.name,
        userDB.email,
        userDB.password,
        userDB.role,
        userDB.created_at
      );
  
      const tokenPayload: tokenPayLoad = {
        id: user.getId(),
        name: user.getName(),
        role: user.getRole(),
      };
      const token = this.tokenManager.createToken(tokenPayload);
  
      const output = {
        message: "Login efetuado com sucesso",
        token: token,
      };
  
      return output;
    };
  
    
  }

