export default (length)=>{
    let randomString = '';
    for(let i=0;i<length;++i){
        if(Math.random()*2 <= 1){
            randomString += (String.fromCharCode(parseInt(Math.random()*25) + 'a'.charCodeAt(0)));
        }else{
            randomString += (String.fromCharCode(parseInt(Math.random()*25) + 'A'.charCodeAt(0)));
        }
    }

    return randomString;
}