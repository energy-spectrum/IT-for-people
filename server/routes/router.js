import { Router } from 'express'
import { authRouter } from "./authRouter.js"
import { proposalRouter } from './proposalRouter.js'

export const router = new Router()

router.use('/auth', authRouter)
router.use('/proposals', proposalRouter)