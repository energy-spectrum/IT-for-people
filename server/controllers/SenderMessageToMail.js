import ExpertModel from "../Models/ExpertModel.js"
import nodemailer from 'nodemailer'
import config from "config"

const transporterData = config.get("transporterData")
const transporter = nodemailer.createTransport({
    service: transporterData.service,
    auth: {
        user: transporterData.companyEmail,
        pass: transporterData.pass
  }
})

const sendToExpertGroups = async (subject, message) => {
    const experts = await ExpertModel.find({})

    for (let i = 0; i < experts.length; i++) {
        send(experts[i].email, subject, message)
    }
}

const send = (toEmail, subject, message) => {
    const mailOptions = {
        from: transporterData.companyEmail,
        to: toEmail,
        subject: subject,
        text: message
    }
      
    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.log(err)
        } else {
            console.log('Email sent: ' + info.response)
        }
    })
}

export  {send as sendEmail, sendToExpertGroups as sendEmailToExpertGroups}