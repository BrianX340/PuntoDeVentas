
window.onload = () => {
    document.addEventListener('keyup', event =>{
        if (event.key === 'Enter') {
            elementId = event.path[0].getAttribute('id')
            if (elementId=='name'){
                document.getElementById('dni').focus()
            } else if (elementId=='dni'){
                document.getElementById('phone').focus()
            } else if (elementId=='phone'){
                nombre = document.getElementById('name').innerText
                dni = document.getElementById('dni').innerText
                telefono = document.getElementById('phone').innerText
                if (nombre&&dni&&telefono){
                    crearCliente(nombre,dni,telefono)
                }
            } else {
                console.log(elementId)
            }
        }
        event.preventDefault()
    })


    document.addEventListener('click', function (e) {
        if (e['path']['0']['className'] == 'limpiar') {
            limpiarCampos()
        } else if (e['path']['0']['className'] == 'volver'){
            window.location = window.location['href'].replace('agregar-clientes','inicio')
        }
    })

}



function crearCliente(name,dni,phone){
    data = {
        name,
        dni,
        phone
    }

    fetch(`${window.origin}/add-client`, {
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
                    enviarLog('Cliente creado<br>Nombre: X<br>DNI: Y<br>Telefono: Z<br>'.replace('X',data['name']).replace('Y',data['dni']).replace('Z',data['phone']))
                    document.getElementById('logs').scrollTop = document.getElementById('logs').scrollHeight
                    limpiarCampos()
                } else if (data['OK']=='EXIST'){
                    enviarLog("El cliente <br> Nombre: X <br> Dni: Y <br>ya existia en la base de datos.".replace('X',data['name']).replace('Y',data['dni']))
                    limpiarCampos()
                }else {
                    enviarLog(data['logs'])
                    limpiarCampos()
                }
            });
        })
        .catch(function (error) {
            console.log("Fetch error: " + error);
        });

}

function enviarLog(string){
    document.getElementById('logs').innerHTML = string
}

function limpiarCampos(){
    document.getElementById('name').innerText = ''
    document.getElementById('dni').innerText = ''
    document.getElementById('phone').innerText = ''
    document.getElementById('name').focus()
}