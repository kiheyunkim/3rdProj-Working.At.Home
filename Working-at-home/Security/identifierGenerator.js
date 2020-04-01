import RandomStringGenerator from '../function/RandomStringGenerator';
import Sha256 from 'sha256';

let adminIdentifier = new Set();
let userIdentifier = new Set();

let tempSet = new Set();

for(let i=0;i<10;++i){
    let key = Sha256(RandomStringGenerator(parseInt(Math.random()*100)));
    while(tempSet.has(key)){
        key = Sha256(RandomStringGenerator(parseInt(Math.random()*100)));
    }
    tempSet.add(key);
    adminIdentifier.add(Sha256(RandomStringGenerator(parseInt(Math.random()*100))));
}

for(let i=0;i<10;++i){
    let key = Sha256(RandomStringGenerator(parseInt(Math.random()*100)));
    while(tempSet.has(key)){
        key = Sha256(RandomStringGenerator(parseInt(Math.random()*100)));
    }
    tempSet.add(key);
    userIdentifier.add(Sha256(RandomStringGenerator(parseInt(Math.random()*100))));
}

tempSet.clear();

let checkAdminAuth = (key) => {
    if(adminIdentifier.has(key)){
        return true;
    }
    return false;
}

let checkUserAuth = (key) => {
    if(userIdentifier.has(key)){
        return true;
    }
    return false;
}

let getAdminAuth = () =>{
    let count = parseInt(Math.random()*(adminIdentifier.size-1));
    let retval= adminIdentifier.values();
    for(let i=0;i<count;++i){
        retval.next();
    }
    
    return retval.value;
}

let getUserAuth = () =>{
    let count = parseInt(Math.random()*(userIdentifier.size-1));
    let retval= userIdentifier.values();
    for(let i=0;i<count;++i){
        retval.next();
    }
    
    return retval.value;
}

export default {checkAdminAuth, checkUserAuth, getAdminAuth, getUserAuth};