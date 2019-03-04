export default (params) => {
    let defaults = {
        "type":"GET",
        "url":"",
        "data":{},
        "async": true,
        "dataType":"json",
        "resolve":"",
        "reject":"",
        "time":10000
    }

    let param = Object.assign({},defaults,params)
    if (param['dataType'] == 'jsonp'){
        return new Promise((resolve, reject) => {
            let head = document.getElementsByTagName('head')[0]
            let dataStr = ''
            //如何把一个对象转换成一个数组，并且用foreach遍历
            Object.keys(param['data']).forEach(key => {
                dataStr += encodeURIComponent(key) + "=" + encodeURIComponent(param.data[key]) + "&"
            })
            //dataStr = dataStr.substring(0,dataStr.length-1)
            let script = document.createElement('script')
            head.appendChild(script)
            script.src = param.url + '?' + dataStr + 'jsoncallback=callback'
            
            //创建jsonp的回调函数
            window["callback"] = function (json) {
                head.removeChild(script)
                clearTimeout(script.timer)
                window[param['dataType']] = null
                param.success && param.success(json)
            }
            if(param.time){
                script.timer = setTimeout(function(){
                    window["callback"] = null
                    head.removeChild(script)
                    param.error && param.error({
                        message:'超时'
                    })
                },param.time)
            }
        })
    }else{
        return new Promise((resolve, reject) => {

            param['type'] = param['type'].toUpperCase()
            let requestObj
            if (window.XMLHttpRequest) {
                requestObj = new XMLHttpRequest()
            } else {
                requestObj = new ActiveXObject
            }
            requestObj.withCredentials = true
            if (param['type'] == 'GET') {
                let dataStr = ''
                //如何把一个对象转换成一个数组，并且用foreach遍历
                Object.keys(param['data']).forEach(key => {
                    dataStr += encodeURIComponent(key) + "=" + encodeURIComponent(data[key]) + "&"
                })
                dataStr = dataStr.substr(0, dataStr.lastIndexOf("&"))
                url = url + "?" + dataStr
                requestObj.open(param['type'], url, async)
                requestObj.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
                requestObj.send()
            } else if (param['type'] == 'POST') {
                requestObj.open(param['type'], url, async)
                requestObj.setRequestHeader("Content-type", "application/json")
                requestObj.send(JSON.stringify(data))
            } else {
                reject('error type')
            }

            requestObj.onreadystatechange = () => {
                if (requestObj.readyState == 4) {
                    if (requestObj.status == 200) {
                        let obj = requestObj.response
                        if (typeof obj !== 'object') {
                            obj = JSON.parse(obj)
                        }
                        resolve(obj)
                    } else {
                        reject(requestObj)
                    }
                }
            }
        })
    }
    
}
//格式化参数
function formatParams(data){
    let arr = []
    for(let key in data){
        arr.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
    }
    return arr.join('&')
}