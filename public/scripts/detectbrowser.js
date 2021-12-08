var isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);

if(isChrome){
    console.log("client using chrome");
}
else{
    document.getElementById("message").innerHTML = "<b>warning:</b> I am detecting that you are not using Chrome. This will probably not display properly or be super laggy X("
}