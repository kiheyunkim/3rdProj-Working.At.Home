$(document).ready(()=>{
    $.post('/login/pwResetInfo','',(result)=>{
        if(result.msgType === 'Error'){
            if(result.state === 'reject'){
                alert('잘못된 접근입니다')
                document.location.href = '/';
            }
        }else if(result.msgType === 'Info'){
            $('#email').val(result.data.email);
            if(result.data.msg === 'passWrong'){
                alert('비밀번호가 일치하지 않습니다');
            }else if(result.data.msg === 'passNotMatch'){
                alert('새 비밀번호가 서로 일치하지 않습니다');
            }
        }
    })
})