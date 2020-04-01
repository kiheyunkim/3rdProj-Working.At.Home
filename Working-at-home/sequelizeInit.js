import fs from 'fs';
import sha256 from 'sha256';
import sequelize from './models/index';
import {Emailsend} from './Controllers/MailSend';
import RandomStringGenerator from './function/RandomStringGenerator';

export default async ()=>{
    try {
        await sequelize.sync();
    } catch (error) {
     
    }
    const transaction = await sequelize.transaction();
   
    let count = -1;
    try {
        count = await sequelize.models.user.count('*',{transaction});
        if(count === 0){
            let adminEmail = JSON.parse(fs.readFileSync(__dirname+'/AuthInfo/admin.json',{encoding:'UTF-8'}));
            let tempPasswd = sha256(RandomStringGenerator(Math.random()*25));
            let length = tempPasswd.length;
            let split = tempPasswd.substr(length - 8, length);
            let salt = sha256(RandomStringGenerator(Math.random()*25 +10));

            await sequelize.models.user.create({
                email:adminEmail.email,
                passwd:sha256(split + salt),
                salt:salt,
                lastchange:new Date(),
                needChange:true
            });

            await Emailsend(adminEmail.email,'비밀번호 재발급','비밀번호:'+split);
        }
        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        return false;
    }
    return true;
}