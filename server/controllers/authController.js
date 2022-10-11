import UserModel from "../Models/UserModel.js"
import ExpertModel from "../Models/ExpertModel.js"
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken'
import config from 'config'


class AuthController{
    async register(req, res){
        try{
            const {fullName, email, password, division} = req.body;
            const saltRounds = 10;
            const passwordHash = await bcrypt.hash(password, saltRounds)
            const user = await UserModel.create({fullName, email, password: passwordHash, division})
            
            const token = jwt.sign(
                {
                    _id: user._id
                },
                config.get('tokenSecret'),
                {
                    expiresIn: '30d'
                }
            )
            res.json({
                userData:{
                    fullName,
                    email,
                    division
                },
                token
            })
        } catch(e){
            console.log(e)
            res.status(500).json({message: 'Что-то пошло не так, попробуйте позже...'})
        }
    }

    async registerExpert(req, res){
        try{
            const {fullName, email, password} = req.body;
            const saltRounds = 10;
            const passwordHash = await bcrypt.hash(password, saltRounds)
            const expert = await ExpertModel.create({fullName, email, password: passwordHash})
            
            const token = jwt.sign(
                {
                    _id: expert._id
                },
                config.get('tokenSecret'),
                {
                    expiresIn: '30d'
                }
            )
            res.json({
                expertData:{
                    fullName,
                    email
                },
                token
            })
        } catch(e){
            console.log(e)
            res.status(500).json({message: 'Что-то пошло не так, попробуйте позже...'})
        }
    }

    async login(req, res){
        try {
            const {email, password} = req.body
            const expert = await ExpertModel.findOne({email})
            if(expert){
                const isPasswordValid = await bcrypt.compare(password, expert.password);
                if (!isPasswordValid) {
                    return res.status(404).json({message: "Неверный  пароль " + password + " " + expert.password});
                }

                const token = jwt.sign(
                    {
                        _id: expert._id
                    },
                    config.get('tokenSecret'),
                    {
                        expiresIn: '30d'
                    }
                )

                return res.json({
                    isExpert: true,
                    fullName: expert.fullName,
                    token
                })
            }
            
            const user = await UserModel.findOne({email})

            if (!user) {
                return res.status(404).json({message: "Неверный логин "});
            }
             
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(404).json({message: "Неверный  пароль " + password + " " + user.password});
            }
            
            const token = jwt.sign(
                {
                    _id: user._id
                },
                config.get('tokenSecret'),
                {
                    expiresIn: '30d'
                }
            )
            
            const {fullName, division} = user

            res.json({
                isExpert: false,
                userData: {
                    fullName,
                    email,
                    division
                },
                token
            })
        } catch(e){
            console.log(e);
            res.status(500).json({message: 'Что-то пошло не так, попробуйте позже...'});
        }
    }
}

export default new AuthController()