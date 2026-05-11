
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
// preview
const preview = document.querySelector("#preview-img");
if (preview) {
    const inputFile = preview.querySelector("#file-input");
    const imgPreview = preview.querySelector("#img-preview");
    inputFile.addEventListener("change", (e) => {
        const src = URL.createObjectURL(e.target.files[0]);
        imgPreview.src = src;
    })
}