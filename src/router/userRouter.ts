import  express  from "express"
import { UserBusiness } from "../business/userBusiness"
import { userDatabase } from "../database/userDataBase"
import { idGenerator } from "../service/idGenerator"
import { tokenManager } from "../service/tokenManager"
import { HashManager } from "../service/hashManager"
import { UserController } from "../controller/userController"



export const userRouter = express.Router()
const userController = new UserController( 
    new UserBusiness(
        new userDatabase(),
        new idGenerator(),
        new tokenManager(),
        new HashManager()
    )
)



userRouter.post("/singup", userController.signup)

userRouter.post("/loogin", userController.login)