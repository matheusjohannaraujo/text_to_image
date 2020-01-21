window.addEventListener("load", function(){

    const iframe = document.querySelector("iframe")
    const url = iframe.src
    let md5 = ""

    function updateImage(){
        let ajax = AJAX()
        ajax.method = 'GET'
        ajax.action = url
        ajax.params = { "md5": 1 }
        ajax.success = function (value) {            
            if(md5 != value){
                md5 = value
                let largura = window.innerWidth
                iframe.src = `${url}?largura=${largura}&random=${parseInt(Math.random() * 999999 * Math.random() * 999999)}`
            }
        }
        ajax.run()
        window.setTimeout(()=>{            
            updateImage()
        }, 2500)
    }

    updateImage()

})