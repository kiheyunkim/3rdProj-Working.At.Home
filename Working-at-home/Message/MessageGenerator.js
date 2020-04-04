export const ResultMessage = (msg, end)=>{
    return `
    <p>${msg}<br>
    <script>
        let goBack = () =>{ window.history.back();}
        let exit = () =>{window.close();}
    </script>
    <button onclick = ${end? "exit()":"goBack()"}>${end?'종료':'뒤로 가기'}</button>
    `;
}