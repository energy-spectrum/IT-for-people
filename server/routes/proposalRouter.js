import { Router } from "express";
import proposalController from "../controllers/proposalController.js";
import {checkValidation, proposalValidations} from "../utils/validations.js";
import checkAuth from '../utils/checkAuth.js'

export const proposalRouter = new Router()

proposalRouter.post('/create', proposalValidations, checkValidation, checkAuth, proposalController.add);
proposalRouter.get('/get-all', proposalController.getAll);
proposalRouter.get('/get-next-accepted', proposalController.getNextAccepted);
proposalRouter.patch('/update-status/:id', checkAuth, proposalController.updateStatus);