
// show alert
const showAlert=document.querySelector("[show-alert]");
if(showAlert){
    const time=parseInt(showAlert.getAttribute("data-time"));
    console.log(time);
    const closeAlert=showAlert.querySelector("[close-alert]");
    setTimeout(()=>{
        showAlert.classList.add("alert-hiden");
    }, time);
    if(closeAlert){
        closeAlert.addEventListener("click",()=>{
            showAlert.classList.add("alert-hiden");
        })
    // console.log(showAlert);
    }
}
// end show alert