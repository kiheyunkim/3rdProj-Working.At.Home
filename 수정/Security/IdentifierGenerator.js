import RandomStringGenerator from './RandomStringGenerator';
import Sha256 from 'sha256';

let adminIdentifier = new Set();
let userIdentifier = new Set();

let setIdentifier = ()=>{
    let tempSet = new Set();
    
    for(let i=0;i<10;++i){
        let key = Sha256(RandomStringGenerator(parseInt(Math.random()*100)));
        while(tempSet.has(key)){
            key = Sha256(RandomStringGenerator(parseInt(Math.random()*100)));
        }
        tempSet.add(key);
        adminIdentifier.add(key);
    }
    
    for(let i=0;i<10;++i){
        let key = Sha256(RandomStringGenerator(parseInt(Math.random()*100)));
        while(tempSet.has(key)){
            key = Sha256(RandomStringGenerator(parseInt(Math.random()*100)));
        }
        tempSet.add(key);
        userIdentifier.add(key);
    }

    tempSet.clear();
}    

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
    let retval = adminIdentifier.values();
    let iterator = retval.next();

    for(let i=0;i<count;++i){
        iterator = retval.next();
    }

    return iterator.value;
}

let getUserAuth = () =>{
    let count = parseInt(Math.random()*(userIdentifier.size-1));
    let retval= userIdentifier.values();
    let iterator = retval.next();

    for(let i=0;i<count;++i){
        iterator = retval.next();
    }
    
    return iterator.value;
}

export {setIdentifier, checkAdminAuth, checkUserAuth, getAdminAuth, getUserAuth};