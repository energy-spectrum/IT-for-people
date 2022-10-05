import nodemailer from 'nodemailer'
import ExpertModel from "../Models/ExpertModel.js";
import config from "config"

const companyEmail = config.get("companyEmail")
var transporter = nodemailer.createTransport({
  service: 'mail.ru',
  auth: {
    user: companyEmail,
    pass: 'uEpBNVZX0hnqfUbSNwuw'
  }
});

async function sendToExpertGroups(subject, message){
    const experts = await ExpertModel.find({})

    for (let i = 0; i < experts.length; i++){
        send(experts[i].email, subject, message)
    }
}

function send(toEmail, subject, message){
    var mailOptions = {
        from: companyEmail,
        to: toEmail,
        subject: subject,
        text: message
    };
      
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

export  {send, sendToExpertGroups};