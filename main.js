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
        // d.l(data, 'found data')
        // 데이터 표기
        document.querySelector('.body').classList.remove('hidden')

        var originData = LZString.decompressFromEncodedURIComponent(data)
        console.log(originData)
        var dp = new DOMParser()
        var doc = dp.parseFromString(originData,"text/html")
        document.querySelector('.body').innerHTML = originData
    }

}


function readDataUrl(type) {
    return new Promise((res, rej) => {
        var targetEle = document.getElementById('plain-data')
        var input = type==="plain" ? targetEle.textContent :
                    type==="rich"? targetEle.innerHTML
                    :""
        // console.log(input)

        if (input.length === 0) {
            rej(new Error('복사할 데이터가 없습니다.'))
        }

        res(LZString.compressToEncodedURIComponent(input))
    })
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

let copyLink = async (type) => {
    await createDataUrl(type)
        .then(data => {
            copytext(data)
            alert('복사완료')
        })
        .catch(err => {
            alert(err)
        })
}

async function qrCode(type) {
    await createDataUrl(type)
        .then(qrUrlData => {
            var qrAPI = "https://chart.googleapis.com/chart?cht=qr&chs=540x540&chld=L|1&choe=UTF-8&chl="
            var qrLink = qrAPI+qrUrlData

            var _a = document.createElement('a')
            _a.href = qrLink    
            _a.target = "_blank"
            _a.click()
            _a.remove()

        })
        .catch(err=>{
            throw err
        })
    
}


async function createDataUrl(type) {
    return new Promise(async (res, rej) => {
        await readDataUrl(type)
            .then(data => {
                console.log(window.location.origin + window.location.pathname + "?" + data)
                res(window.location.origin + window.location.pathname + "?" + data)
            })
            .catch(err => {
                rej(err.message)
            })
    })
}