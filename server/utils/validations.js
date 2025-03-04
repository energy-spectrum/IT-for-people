import {body, validationResult} from 'express-validator'

export const registrationValidations = [
    body('fullName', 'Длина имени должна быть от 3 до 35 символов').isLength({min:3, max:35}),
    body('email', 'Неверный формат почты').isEmail(),
    body('password', 'Длина пароля должна быть от 6 до 25').isLength({min:6, max:25})
]

export const proposalValidations = [
    body('title', 'Длина title должна быть от 2 до 50 символов').isLength({min:2, max:50}),
    body('description', 'Длина описания должна быть от 10 до 300 символов').isLength({min:10, max:300})
]

export const checkValidation = (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json(errors.array().map(e => ({
            message:e.msg
        })))
    }
    next()
}