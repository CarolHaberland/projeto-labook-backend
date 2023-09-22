import { UserBusiness } from "../business/userBusiness";
import { SignupSchema } from "../dtos/user/singup.dto";
import { ZodError } from "zod"
import { Request, Response } from "express";
import { baseError } from "../error/Error";
import { LoginSchema } from "../dtos/user/loogin.dto";



export class UserController {
    constructor(
      private userBusiness: UserBusiness
    ){}
  
    public signup = async (req: Request, res: Response) => {
      try {
        const input = SignupSchema.parse({
           name: req.body.name,
           email: req.body.email,
           password: req.body.password
         })
         console.log("Dados de entrada validados com sucesso:", input);
         const output = await this.userBusiness.signup(input)
         console.log("Operação de signup concluída com sucesso:", output);
   
         res.status(201).send(output)
      } catch (error) {
        console.error("Erro durante a operação de signup:", error);
        if (error instanceof ZodError) {
          res.status(400).send(error.issues)
        } else if (error instanceof baseError) {
          res.status(error.status).send(error.message)
        } else {
          res.status(500).send("Erro inesperado")
        }
      }
    };
  
    public login = async (req: Request, res: Response) => {
      try {
        const input =  LoginSchema.parse({
          email: req.body.email,
          password: req.body.password
        })
  
        const output = await this.userBusiness.login(input);
        res.status(200).send(output);
      } catch (error) {
        if (error instanceof ZodError) {
          res.status(400).send(error.issues)
        } else if (error instanceof baseError) {
          res.status(error.status).send(error.message)
        } else {
          res.status(500).send("Erro inesperado")
        }
      }
    }
  }