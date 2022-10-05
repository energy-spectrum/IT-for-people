import ExpertModel from "../Models/ExpertModel.js";
import ProposalModel from "../Models/ProposalModel.js";
import UserModel from "../Models/UserModel.js";

import {send, sendToExpertGroups} from "./SenderMessageToMail.js"

class ProposalController{
    async add(req, res){
        try{
            const user = await UserModel.findById(req.userId).exec()

            if(!user){
                return res.status(403).json({
                    message: "Нет доступа"
                })
            }

            const {title, description} = req.body
            const NotConsidered = 0;
            const proposal = await ProposalModel.create({title, description, userID: user._id, status: NotConsidered})

            send(user.email, 'Статус заявки ' + proposal._id, 'Ваша заявка добавлена на рассмотрение экспертам. Номер вашей заявки ' + proposal._id)
            await sendToExpertGroups('Новая заявка ' + proposal._id, 'Заявка ожидает рассмотрение. Номер заявки ' + proposal._id)

            return res.json({
                proposalID: proposal._id
            })
        } catch(e){
            console.log(e)
            res.status(500).json({message: '1Что-то пошло не так, попробуйте позже...'})
        }
    }
    
    async getAll(req, res){
        try{
            const proposals = await ProposalModel.find({})
           
            return res.json({
                proposals
            })
        } catch(e){
            console.log(e)
            res.status(500).json({message: 'Что-то пошло не так, попробуйте позже...'})
        }
    }

    //TODO Реализовать правильно функцию
    async getNextAccepted(req, res){
        try{
            const {numberProposals} = req.body
            const acceptedProposals = await ProposalModel.aggregate([{ $sample: { size: numberProposals } }]);
            //const acceptedProposals = await ProposalModel.find({status: 1}, null, {limit: numberProposals})
           
            return res.json({
                acceptedProposals
            })
        } catch(e){
            console.log(e)
            res.status(500).json({message: 'Что-то пошло не так, попробуйте позже...'})
        }
    }

    async updateStatus(req, res){
        try{
            const expert = await ExpertModel.findById(req.userId)
            if(!expert) {
                return res.status(403).json({
                    message: "Нет доступа!"
                })
            }

            const {status} = req.body
            if (!(status === -1 || status == 1)) {
                return res.status(400).json({
                    message: "Изменить статус можно только на -1 или на 1!"
                })
            }

            const idProposal = req.params.id
            const proposal = await ProposalModel.findByIdAndUpdate(idProposal, {status}, {new: true})
            if(!proposal) {
                return res.status(404).json({
                    message: "Заявка не найдена!"
                })
            }

            let message;
            if (status === 1){
                message = "Ваша заяка принята."
            } else if(status === -1){
                message = "Ваша заяка отклонена."
            }
            send("batarei14@gmail.com", message + " Название идеи " + proposal.title)

            return res.json({
                success: true,
                proposalStatus: proposal.status
            })
        } catch(e){
            console.log(e)
            res.status(500).json({message: 'Что-то пошло не так, попробуйте позже...'})
        }
    }
}

export default new ProposalController()