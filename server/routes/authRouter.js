import { Router } from "express"
import authController from "../controllers/authController.js"
import { registrationValidations, checkValidation} from "../utils/validations.js"

export const authRouter = new Router()

authRouter.post('/registration', registrationValidations, checkValidation, authController.register)
//Временно
authRouter.post('/registration/expert', registrationValidations, checkValidation, authController.registerExpert)

authRouter.post('/login', authController.login)