$(document).ready(()=>{
    $('#googleLogin').click(()=>{
        document.location.href='/loginRequest?type=google';
    });

    $('#PWfind').click(()=>{
        var popOption = "width=500, height=500, resizable=no, scrollbars=no, status=no;";
        window.open('/pwResetRequest','',popOption);
    });

    $('#signup').click(()=>{
        document.location.href='/signupRequest';
    });
})