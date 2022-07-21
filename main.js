var d = {
    flag:true,
    get l(){return d.flag?console.log:()=>{}}
}


document.onreadystatechange = ()=>{
    if(document.readyState !== 'complete'){
        return
    }
    
    console.log('DOM loaded')
    var data = window.location.search.slice(1).split(",").at(-1)

    if(data.length===0){
        // menu 표기
        document.querySelector('.menu').classList.remove('hidden')


    }
    else{
        d.l(data,'found data')
        // 데이터 표기
        document.querySelector('.body').classList.remove('hidden')

        var dataUrl  ="data:application/octet-stream;base64,"+decodeURIComponent(data)
        
        fetch(dataUrl,{type:"text/plain"})        
        .then(res=>res.text())
        .then(text=>{
            document.querySelector('.body').innerHTML = text
        })
    
    }
}



function readDataUrl(){
    return new Promise((res,rej)=>{
        var input = document.getElementById('plain-data').value
        if(input.length === 0 ){
            rej('')
        }


        var blob = new Blob([input])
    
        var reader = new FileReader()
        reader.addEventListener('loadend',ev=>{
            res(ev.target.result.split(",").at(-1))
        })
        reader.readAsDataURL(blob)
    })
}

let removeChild = (element)=>{
    let childEles = element.querySelectorAll("*")
    childEles?.forEach(child=>child.remove())
}

async function qrCode(){
    let qrcodeContainer = document.querySelector('#qrcode-container')
    removeChild(qrcodeContainer)
    var qrUrlData = window.location.origin + window.location.pathname +"?"+ await readDataUrl()
    console.log(qrUrlData)

    var qrcode = new QRCode(qrcodeContainer,{
        text: qrUrlData,
        width: 600,
        height: 600,
        colorDark : "#000000",
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.H
    })
    qrcode.makeCode(qrUrlData)
}