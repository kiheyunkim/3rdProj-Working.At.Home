import RandomStringGenerator from './RandomStringGenerator';
import Sha256 from 'sha256';

let adminIdentifier = null;
let userIdentifier = null;
let isInitialized = false;

let setIdentifier = ()=>{
    let tempSet = new Set();
    adminIdentifier = new Set();
    userIdentifier = new Set();

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
    if(!isInitialized){
        setIdentifier();
        isInitialized=true;
    }

    if(adminIdentifier.has(key)){
        return true;
    }
    return false;
}

let checkUserAuth = (key) => {
    if(!isInitialized){
        isInitialized=true;
        setIdentifier();
    }

    if(userIdentifier.has(key)){
        return true;
    }
    return false;
}

let getAdminAuth = () =>{
    if(!isInitialized){
        setIdentifier();
        isInitialized=true;
    }

    let count = parseInt(Math.random()*(adminIdentifier.size-1));
    let retval = adminIdentifier.values();
    let iterator = retval.next();

    for(let i=0;i<count;++i){
        iterator = retval.next();
    }

    return iterator.value;
}

let getUserAuth = () =>{
    if(!isInitialized){
        setIdentifier();
        isInitialized=true;
    }
    
    let count = parseInt(Math.random()*(userIdentifier.size-1));
    let retval= userIdentifier.values();
    let iterator = retval.next();

    for(let i=0;i<count;++i){
        iterator = retval.next();
    }
    
    return iterator.value;
}

export {setIdentifier, checkAdminAuth, checkUserAuth, getAdminAuth, getUserAuth};