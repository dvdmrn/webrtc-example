var isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);

if(isChrome){
    console.log("client using chrome");
}
else{
    document.getElementById("message").innerHTML = "How naughty, I am detecting that you are not using Chrome. This will probably not display properly X( <p> Yeah I know Chrome sucks but I don't make the API"
}