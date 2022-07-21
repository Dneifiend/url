var d = {
    flag: true,
    get l() { return d.flag ? console.log : () => { } }
}


document.onreadystatechange = () => {
    if (document.readyState !== 'complete') {
        return
    }
    console.log('DOM loaded')

    // 데이터 부분 추출
    var data = window.location.search.slice(1).split(",").at(-1)

    if (data.length === 0) {
        // menu 표기
        document.querySelector('.menu').classList.remove('hidden')
    }
    else {
        d.l(data, 'found data')
        // 데이터 표기
        document.querySelector('.body').classList.remove('hidden')

        var dataUrl = "data:application/octet-stream;base64," + decodeURIComponent(data)

        fetch(dataUrl, { type: "text/plain" })
            .then(res => res.text())
            .then(text => {
                document.querySelector('.body').innerHTML = text
            })
    }
}



function readDataUrl() {
    return new Promise((res, rej) => {
        var input = document.getElementById('plain-data').value
        if (input.length === 0) {
            rej(new Error('복사할 데이터가 없습니다.'))
        }


        var blob = new Blob([input])

        var reader = new FileReader()
        reader.addEventListener('loadend', ev => {
            res(ev.target.result.split(",").at(-1))
        })
        reader.readAsDataURL(blob)
    })
}

let removeChild = (element) => {
    let childEles = element.querySelectorAll("*")
    childEles?.forEach(child => child.remove())
}

let copytext = (text) => {
    var tempElem = document.createElement('textarea');
    if (text.length === 0) {
        return false
    }
    tempElem.value = text
    document.body.appendChild(tempElem);

    tempElem.select();
    document.execCommand("copy");
    document.body.removeChild(tempElem);
    return true
}

let copyLink = async () => {
    await createDataUrl()
        .then(data => {
            copytext(data)
            alert('복사완료')
        })
        .catch(err => {
            alert(err)
        })
}

async function qrCode() {
    await createDataUrl()
        .then(qrUrlData => {
            let qrcodeContainer = document.querySelector('#qrcode-container')
            removeChild(qrcodeContainer)

            var qrcode = new QRCode(qrcodeContainer, {
                text: qrUrlData,
                width: 600,
                height: 600,
                colorDark: "#000000",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.H
            })
            qrcode.makeCode(qrUrlData)

        })
        .catch(err => {
            alert(err)
        })

}


async function createDataUrl() {
    return new Promise(async (res, rej) => {
        await readDataUrl()
            .then(data => {
                res(window.location.origin + window.location.pathname + "?" + data)
            })
            .catch(err => {
                rej(err.message)
            })
    })
}