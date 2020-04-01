let blackListIPList = new Map();

let checkBlackList = (ip)=>{
    if(!blackListIPList.has(ip)){
        blackListIPList.set(ip, {count:0, blockTimer:new Date()});
        return 0;
    }else{
        let targetInfo = blackListIPList.get(ip);
        let currentDate = new Date();
        if(targetInfo.count >= 10){                             //아예 차단
            return -1;
        }else{
            if(currentDate.getTime() - targetInfo.blockTimer.getTime() > 24*60*60*1000){ //특별 사면
                blackListIPList.set(ip, {count:0, blockTimer:new Date()});
                return 0;
            }else if(targetInfo.count <= 5){
                return 0;
            }else {
                if(currentDate > targetInfo.blockTimer){
                    return 0;
                }else{
                    return targetInfo.blockTimer.getTime() - currentDate.getTime();
                }
            }
        }
    }
}

let addBlackListCount = (ip)=>{
    let prevValue = blackListIPList.get(ip);
    let sinMinute = prevValue.blockTimer;
    if(prevValue.count > 5){
        sinMinute = new Date();
        sinMinute.setSeconds(sinMinute.getSeconds() + 60 * prevValue.count * 3);
    }
    blackListIPList.set(ip,{count:prevValue.count + 1, blockTimer:sinMinute});
}

export {checkBlackList, addBlackListCount};