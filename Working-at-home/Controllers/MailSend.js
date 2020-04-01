import nodemailer from 'nodemailer';
import fs from 'fs';

const mailAuthInfo = JSON.parse(fs.readFileSync(__dirname+'\\..\\AuthInfo\\emailAuthInfo.json',{encoding:'UTF-8'}));

let message = (sendTo,subject,text)=>({
        from:mailAuthInfo.EMAIL,
        to:sendTo,
        subject:subject,
        text:text
    });

const smtpConfig={
    host:"smtp.gmail.com",
    port:465,
    secure:true,
    auth:{
        user:mailAuthInfo.EMAIL,
        pass:mailAuthInfo.PASSWORD
    }
}

export const Emailsend = (sendTo, subject, text) =>{
    return new Promise((resolve,reject)=>{
        if(sendTo === undefined||subject === undefined || text===undefined){
            reject(new Error("Cannot Inject Param with undefine"));
            return;
        }
        
        if(sendTo.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/) === null){
            reject(new Error("Email Type Not Correct"));
            return;
        }
    
        let transporter = nodemailer.createTransport(smtpConfig);
    
        transporter.sendMail(message(sendTo, subject, text),(error,response)=>{
            if(error){
                reject(new Error("Email Send Error"));
                return;
            }else{
                resolve('ok');
                return;
            }
        });
    });
};
