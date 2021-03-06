import fs from 'fs';
import sha256 from 'sha256';
import sequelize from './models/index';
import {Emailsend} from './functions/MailSend';
import RandomStringGenerator from './Security/RandomStringGenerator';

export default async ()=>{
    try {
        await sequelize.sync();
    } catch (error) {
        console.log(error);
        return false;
    }
    const transaction = await sequelize.transaction();
    
    let count = -1;
    count = await sequelize.models.user.count('*',{transaction});
    try {
        if(count === 0){
            await sequelize.models.whitelist.create({email:'kiheyunkim@gmail.com',employeenum:1234, name:'김기현',grade:'admin'},{transaction});
            let adminEmail = JSON.parse(fs.readFileSync(__dirname+'/AuthInfo/admin.json',{encoding:'UTF-8'}));
            let tempHash = sha256(RandomStringGenerator(Math.random()*40 + 10));
            let length = tempHash.length;
            let tempPasswd = tempHash.substr(length - 8, length);
            let salt = sha256(RandomStringGenerator(Math.random()*40 + 10));

            await sequelize.models.user.create({
                email:adminEmail.email,
                accountType:'local',
                passwd:sha256(tempPasswd + salt),
                salt:salt,
                verification:'',
                verified:true,
                lastchange:new Date(),
                needChange:true
            },{transaction});

            await sequelize.models.employee.create({
                email:adminEmail.email,
                name:'admin',
                employeenum:0,
                grade:'admin',
                verified:true
            },{transaction});
            
            await Emailsend(adminEmail.email,'비밀번호 재발급','비밀번호:'+tempPasswd);
        }
        await transaction.commit();
    } catch (error) {
        console.log(error);
        await transaction.rollback();
        return false;
    }
    return true;
}