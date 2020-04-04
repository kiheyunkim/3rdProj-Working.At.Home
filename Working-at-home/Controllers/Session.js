import fs from 'fs';
import sha256 from 'sha256';
import RandomStringGenerator from './../Security/RandomStringGenerator';
import session from 'express-session';
const MySQLStore = require('express-mysql-session')(session);
const connectionInfo = JSON.parse(fs.readFileSync(__dirname+'/../AuthInfo/dbAuthInfo.json',{encoding:'UTF-8'}));

export default(app)=>{
    let sessionSqlOptions ={
        host : connectionInfo.host,
        port : connectionInfo.port,
        user : connectionInfo.user,
        password: connectionInfo.password,
        clearExpired : true,
        database : connectionInfo.database,
        endConnectionOnClose : true,
    };
    
    const sessionStore = new MySQLStore(sessionSqlOptions);

    app.use(session({
        resave : false,
        saveUninitialized : false,
        secret : sha256(RandomStringGenerator(parseInt(Math.random()*50)).toString()),
        store : sessionStore,
        cookie : { secure : false }
    }));
}