import ExpertModel from "../Models/ExpertModel.js"
import ProposalModel from "../Models/ProposalModel.js"
import UserModel from "../Models/UserModel.js"

import fs from "fs"
import excel from "excel4node"

import config from "config"

import { sendEmail, sendEmailToExpertGroups } from "./SenderMessageToMail.js"


const filePathToLastProposalNumber = config.get("fileNameToLastProposalNumber")

const createProposalNumber = () => {
    const sNumber = fs.readFileSync(filePathToLastProposalNumber, "utf-8")
    return Number(sNumber) + 1
}

const writeLastProposalNumber = (number) => {
    fs.writeFileSync(filePathToLastProposalNumber, number.toString())
}
//Когда-то понадобиться, если нужно будет получать номер заявки с начала
const clearLastProposalNumber = () => {
    const filePath = config.get("filePathToLastProposalNumber")
    const startingValue = -1;
    fs.writeFileSync(filePath, startingValue)
}

const toEcxelFile = async (proposals = []) => {
    try {
        // Create a new instance of a Workbook class
        const workbook = new excel.Workbook()

        // Add Worksheets to the workbook
        const worksheet = workbook.addWorksheet('Sheet 1')

        // Create a reusable style
        const style = workbook.createStyle({
            font: {
                color: '#000000',
                size: 12
            },
        })

        const rowWithColumnNames = 1
        worksheet.cell(rowWithColumnNames, 1).string("Номер заявки").style(style)
        worksheet.cell(rowWithColumnNames, 2).string("Название идеи").style(style)
        worksheet.cell(rowWithColumnNames, 3).string("Описание").style(style)
        worksheet.cell(rowWithColumnNames, 4).string("ФИО").style(style)

        for (let i = 0; i < proposals.length; i++) {
            const row = i + rowWithColumnNames + 1
            worksheet.cell(row, 1).number(proposals[i].number).style(style)
            worksheet.cell(row, 2).string(proposals[i].title).style(style)
            worksheet.cell(row, 3).string(proposals[i].description).style(style)

            const user = await UserModel.findById(proposals[i].userId).exec()
            if (user) {
                worksheet.cell(row, 4).string(user.fullName).style(style)
            }
        }

        const filePath = config.get('filePathToExcelFile')
        workbook.write(filePath)

        return filePath
    } catch (err) {
        throw err
    }
}

class ProposalController {
    async add(req, res) {
        try {
            const user = await UserModel.findById(req.userId).exec()
            if (!user) {
                return res.status(403).json({
                    message: "Нет доступа"
                })
            }
            
            const proposalNumber =  createProposalNumber()
            const {title, description} = req.body
            const NotConsidered = 0;
            const proposal = await ProposalModel.create({
                number: proposalNumber, 
                title, description, 
                userId: user._id,
                status: NotConsidered
            })
            
            writeLastProposalNumber(proposalNumber)

            sendEmail(user.email, 'Статус заявки ' + proposal._id, 'Ваша заявка добавлена на рассмотрение экспертам. Номер вашей заявки ' + proposal._id)
            await sendEmailToExpertGroups('Новая заявка ' + proposal._id, 'Заявка ожидает рассмотрение. Номер заявки ' + proposal._id)

            return res.json({
                proposalID: proposal._id,
                proposalNumber
            })
        } catch(err){
            console.log(err)
            res.status(500).json({
                message: 'Что-то пошло не так, попробуйте позже...'
            })
        }
    }
    
    async removeAll(req, res) {
        try {
            await ProposalModel.deleteMany()
            res.json({
                message: 'Все заявки удалены'
            })
        } catch (err) {
            console.log(err)
            res.status(500).json({
                message: 'Что-то пошло не так, попробуйте позже...'
            })
        }
    }
    async getAllProposalsInFile(req, res) {
        try {
            const proposals = await ProposalModel.find({})
            const filePath = await toEcxelFile(proposals)
            
            res.download(filePath)
        } catch (err) {
            console.log(err)
            res.status(500).json({message: 'Что-то пошло не так, попробуйте позже...'})
        }
    }

    //Вспомогательная для понимания что находиться внутри БД
    async getAll(req, res) {
        try {
            const proposals = await ProposalModel.find({})
            return res.json({
                proposals
            })
        } catch (err) {
            console.log(err)
            res.status(500).json({message: 'Что-то пошло не так, попробуйте позже...'})
        }
    }

    async getNextAccepted(req, res) {
        try {
            const {numberSkipped, numberProposals} = req.body
            const Accepted = config.get("status.Accepted")
            const query = ProposalModel.find({status: Accepted}).sort("_id").skip(numberSkipped).limit(numberProposals)
            query.exec((err, acceptedProposals) => {
                if (err) {
                    console.log(err)
                    return res.status(500).json({
                        message: 'Что-то пошло не так, попробуйте позже...'
                    })
                }

                return res.json({
                    acceptedProposals
                })
            })
        } catch (err) {
            console.log(err)
            res.status(500).json({message: 'Что-то пошло не так, попробуйте позже...'})
        }
    }

    async getNextNotConsidered(req, res) {
        try {
            const {numberSkipped, numberProposals} = req.body
            const NotConsidered = 0
            const query = ProposalModel.find({status: NotConsidered}).sort("_id").skip(numberSkipped).limit(numberProposals)
            query.exec((err, notConsideredProposals) => {
                if (err) {
                    console.log(err)
                    return res.status(500).json({
                        message: 'Что-то пошло не так, попробуйте позже...'
                    })
                }

                return res.json({
                    notConsideredProposals
                })
            })
        } catch (err) {
            console.log(err)
            res.status(500).json({message: 'Что-то пошло не так, попробуйте позже...'})
        }
    }

    //  User  /////////////////////////////
    async userGetAll(req, res) {
        try {
            const proposals = await ProposalModel.find({userId: req.userId})
            return res.json({
                proposals
            })
        } catch (err) {
            console.log(err)
            res.status(500).json({message: 'Что-то пошло не так, попробуйте позже...'})
        }
    }

    async userGetNextAccepted(req, res) {
        try {
            const {numberSkipped, numberProposals} = req.body
            const Accepted = 1
            const query = ProposalModel.find({userId: req.userId, status: Accepted}).sort("_id").skip(numberSkipped).limit(numberProposals)
            query.exec((err, acceptedProposals) => {
                if (err) {
                    console.log(err)
                    return res.status(500).json({
                        message: 'Что-то пошло не так, попробуйте позже...'
                    })
                }

                return res.json({
                    acceptedProposals
                })
            })
        } catch (err) {
            console.log(err)
            res.status(500).json({message: 'Что-то пошло не так, попробуйте позже...'})
        }
    }

    async userGetNextNotConsidered(req, res) {
        try {
            const NotConsidered = 0
            const options = {
                userId: req.userId,
                status: NotConsidered
            }
            const {numberSkipped, numberProposals} = req.body
            const notConsideredProposals = getCertainProposals(options, numberSkipped, numberProposals)

            return res.json({
                notConsideredProposals
            })
        } catch (err) {
            console.log(err)
            res.status(500).json({message: 'Что-то пошло не так, попробуйте позже...'})
        }
    }

    async userGetNextRejected(req, res) {
        try {
            const Rejected = -1
            const options = {
                userId: req.userId,
                status: Rejected
            }
            const {numberSkipped, numberProposals} = req.body
            const rejectedProposals = getCertainProposals(options, numberSkipped, numberProposals)

            return res.json({
                rejectedProposals
            })
        } catch (err) {
            console.log(err)
            res.status(500).json({message: 'Что-то пошло не так, попробуйте позже...'})
        }
    }

    async updateStatus(req, res) {
        try {
            const expert = await ExpertModel.findById(req.userId)
            if (!expert) {
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
            if (!proposal) {
                return res.status(404).json({
                    message: "Заявка не найдена!"
                })
            }

            const user = await UserModel.findById(proposal.userId)
            if (!user) {
                return res.status(200).json({
                    success: true,
                    proposalStatus: proposal.status,
                    message: "Пользователь данной заявки не найден!"
                })
            }
            
            notifyUserOfStatusChange(proposal, user.email);

            return res.json({
                success: true,
                proposalStatus: proposal.status
            })
        } catch (err) {
            console.log(err)
            res.status(500).json({message: 'Что-то пошло не так, попробуйте позже...'})
        }
    }
}

//options: {[userId: req.userId], status: status}
const getCertainProposals = (options, numberSkipped, numberProposals) => {
    const query = ProposalModel.find(options)//{[userId: req.userId], status: status})
                                .sort("_id")
                                .skip(numberSkipped)
                                .limit(numberProposals)
    query.exec((err, proposals) => {
        if (err) {
            throw err
        }

        return proposals
    })
}

const notifyUserOfStatusChange = (proposal, userEmail) => {
    const subject = "Статус заявки"

    let message;
    if (proposal.status === 1) {
        message = "Ваша заяка принята."
    } else if (proposal.status === -1) {
        message = "Ваша заяка отклонена."
    }
    else {
        throw 'У заявки должен быть статус либо "принято", либо "отклонено"!'
    }
    message += " Название идеи " + proposal.title + "."
    message += " Номер заявки " + proposal.number

    sendEmail(userEmail, subject, message)
}


export default new ProposalController()