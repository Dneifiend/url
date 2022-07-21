var data = window.location.pathname.slice(4).split(",").at(-1)
var dataUrl  ="data:application/octet-stream;base64,"+decodeURIComponent(data)

fetch(dataUrl,{type:"text/plain"})
.then(res=>res.text())
.then(text=>{
    document.querySelector('.body').innerHTML = text
})