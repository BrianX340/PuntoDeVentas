
window.onload = () => {
    
    document.addEventListener('keyup', function (e) {
        if (e.key === 'Enter') {
            mensajetipo = e.path[0].getAttribute('mensajetipo')
            /* Aca separamos por tipo de mensaje */
            if (mensajetipo == 'inbarcode') {
                let barcode = document.getElementById('inbarcode').value
                if (barcode){
                    document.getElementById('inname').focus()
                }
            } else if (mensajetipo == 'inname') {
                let name = document.getElementById('inname').value
                if (name){
                    document.getElementById('inprice').focus()
                }
            } else if (mensajetipo == 'inprice') {
                let barcode = document.getElementById('inbarcode')
                let name = document.getElementById('inname')
                let price = document.getElementById('inprice')

                if (price.value && name.value && barcode.value ){
                    let testRegex = /\d/; //Expresion regular para veridicar que price y barcode sean numeros
                    if (testRegex.test(barcode.value) && testRegex.test(price.value)){
                        submit_article(price,name,barcode)
                    } else {
                        enviarLog('El codigo de barras o precio es INCORRECTO, reintente.')
                        limpiarCampos()
                    }
                    
                }
            }
        }
    })

    document.addEventListener('click', function (e) {
        if (e['path']['0']['className'] == 'limpiar') {
            limpiarCampos()
        } else if (e['path']['0']['className'] == 'volver'){
            window.location = window.location['href'].split('-art')[0].replace('agregar','inicio')
        }
    })




}


function submit_article(price,name,barcode){

    data = {
        'barcode': barcode.value,
        'name': name.value,
        'price': price.value,
        'cantidad': 8
    }

    fetch(`${window.origin}/add-articulos`, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(data),
        cache: "no-cache",
        headers: new Headers({
            "content-type": "application/json"
        })
    })
        .then(function (response) {
            if (response.status !== 200) {
                console.log(`Looks like there was a problem. Status code: ${response.status}`);
                return;
            }
            response.json().then(function (data) {
                if (data['OK']=='YES'){
                    enviarLog('Articulo Creado<br>Nombre: X<br>Precio: Y<br>Codigo de Barras: Z<br>'.replace('X',data['name'].toUpperCase()).replace('Y',data['price']).replace('Z',data['barcode']))
                    document.getElementById('logs').scrollTop = document.getElementById('logs').scrollHeight
                    limpiarCampos()
                } else if (data['OK']=='EXIST'){
                    enviarLog("El Articulo <br> Nombre: X <br> Codigo: Y <br>ya existia en la base de datos se reemplazo por el nuevo nombre y precio.".replace('X',data['name']).replace('Y',data['barcode']))
                    limpiarCampos()
                }else {
                    enviarLog(data['logs'])
                }
            });
        })
        .catch(function (error) {
            console.log("Fetch error: " + error);
        });

}

function limpiarCampos(){
    document.getElementById('inbarcode').value = ''
    document.getElementById('inname').value = ''
    document.getElementById('inprice').value = ''
    document.getElementById('inbarcode').focus()
}

function enviarLog(string){
    document.getElementById('logs').innerHTML = string
}