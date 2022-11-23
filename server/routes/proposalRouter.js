import { Router } from "express"
import proposalController from "../controllers/proposalController.js"
import {checkValidation, proposalValidations} from "../utils/validations.js"
import checkAuth from '../utils/checkAuth.js'

export const proposalRouter = new Router()

proposalRouter.post('/create', proposalValidations, checkValidation, checkAuth, proposalController.add)
proposalRouter.delete('/del-all', proposalController.removeAll)

proposalRouter.get('/get-all-in-file', checkAuth, proposalController.getAllProposalsInFile)

proposalRouter.get('/get-all', proposalController.getAll)
proposalRouter.get('/get-next-accepted', proposalController.getNextAccepted)
proposalRouter.get('/get-next-not-considered', proposalController.getNextNotConsidered)

proposalRouter.get('/user/get-all/', checkAuth, proposalController.userGetAll)
proposalRouter.get('/user/get-next-accepted/', checkAuth, proposalController.userGetNextAccepted)
proposalRouter.get('/user/get-next-not-considered/', checkAuth, proposalController.userGetNextNotConsidered)
proposalRouter.get('/user/get-next-rejected/', checkAuth, proposalController.userGetNextRejected)

proposalRouter.patch('/update-status/:id', checkAuth, proposalController.updateStatus)
proposalRouter.put('/like/:id', checkAuth, proposalController.likeProposal);