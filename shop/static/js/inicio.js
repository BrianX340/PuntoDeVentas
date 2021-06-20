var carrito = {}
var total_cuenta = 0

window.onload = () => {


    document.addEventListener('click', function (e) {//aca escuchamos cualquier click
        if (e['path']['0']['className'] == 'add-articles') {//si el click se realizo en el div con x classname se se jecuta la accion para ese div
            //ir a la pagina de add
            window.location = window.location['href'].replace('inicio', 'agregar-articulos');
        } else if (e['path']['0']['className'] == 'totalizator') {
            if (total_cuenta>0){
                document.getElementsByClassName('efectivo-o-fiado')[0].style.display = 'flex'
                document.getElementsByClassName('anulador')[0].style.display = 'none'

            }
        } else if (e['path']['0']['className'] == 'anular-venta'){
            if (total_cuenta>0){
                document.getElementsByClassName('anulador')[0].style.display = 'flex'
                document.getElementsByClassName('efectivo-o-fiado')[0].style.display = 'none'

            }
        } else if (e['path']['0']['className'] == 'cancel'){
            document.getElementsByClassName('anulador')[0].style.display = 'none'
            document.getElementsByClassName('efectivo-o-fiado')[0].style.display = 'none'

        } else if (e['path']['0']['className'] == 'anulardefinitivo'){
            document.getElementsByClassName('anulador')[0].style.display = 'none'
            document.getElementsByClassName('efectivo-o-fiado')[0].style.display = 'none'
            
            total_cuenta = 0
            carrito = {}
            mostrarCarrito()
        } else if (e['path']['0']['className'] == 'add-clientes'){
            window.location = window.location['href'].replace('inicio', 'agregar-clientes');
        }
    })

    document.addEventListener('keyup', function (e) {
        if (e.key === 'Enter') {
            mensajetipo = e.path[0].getAttribute('mensajetipo')
            /* Aca separamos por tipo de mensaje */
            if (mensajetipo == 'barcodescan') {
                let barcode = document.getElementById('barcodescan')
                if (barcode) {
                    barcode = barcode.value.split('*')
                    if (barcode.length==2){
                        let cantidad = Number(barcode[0])
                        agregarArticulo(Number(barcode[1]), cantidad)
                    } else if (barcode.length==1){
                        agregarArticulo(Number(barcode[0]), 1)
                    }
                    
                }
            }
        }
    })

}

function agregarArticulo(barcode, cantidad_agregar) {
    if (carrito[barcode]) {
        let name = carrito[barcode]['name']
        let price = carrito[barcode]['price']
        let cantidad = carrito[barcode]['cantidad']
        cantidad = Number(cantidad) + cantidad_agregar
        let total = Number(cantidad) * Number(price)
        total = redondeo(total, decimales = 2)

        let barcode_new = {
            'name': name,
            'price': price,
            'cantidad': cantidad,
            'total': total,
        }
        carrito[barcode] = barcode_new
        mostrarCarrito()
    } else {
        let entry = {
            'barcode': barcode
        };
        fetch(`${window.origin}/consulta-barcode`,
            {
                method: "POST",
                credentials: "include",
                body: JSON.stringify(entry),
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
                    if (data['response'] == 'OK') {
                        //añadimos al carrito
                        let num = 1

                        let name = data['name']
                        let price = data['price']
                        let cantidad = num
                        let total = data['price']

                        let barcode_new = {
                            'name': name,
                            'price': price,
                            'cantidad': cantidad,
                            'total': total,
                        }

                        carrito[barcode] = barcode_new
                        //mostramos carrito
                        mostrarCarrito()

                    } else if (data['response'] == 'error') {
                        //en caso que el codigo de barras no exista mostrar en el display un mensaje
                        console.log('Error - line 63')
                        document.getElementById('barcodescan').value = ''
                    }
                });
            })
            .catch(function (error) {
                console.log("Fetch error: " + error);
            });
    }
}



function mostrarCarrito() {
    let bloque = ''
    let totalizado = 0
    for (let articulo in carrito) {
        let base = "<div class='articulo_cargado'><span>NOMBRE x CANTIDAD = $TOTAL</span><span>x1 = $PRECIO</span><span></span></div>"
            .replace('NOMBRE', carrito[articulo].name.toUpperCase())
            .replace('CANTIDAD', carrito[articulo].cantidad)
            .replace('PRECIO', carrito[articulo].price)
            .replace('TOTAL', carrito[articulo].total)
        bloque = bloque.concat(base)
        totalizado = Number(totalizado) + ( Number(carrito[articulo].price)*Number(carrito[articulo].cantidad) )
    }
    document.getElementById('visor-articulos-cargados').innerHTML = bloque
    document.getElementById('visor-articulos-cargados').scrollTop = document.getElementById('visor-articulos-cargados').scrollHeight
    document.getElementById('barcodescan').value = ''
    document.getElementById('monto-cobrar').textContent = '$    TOTAL'.replace('TOTAL',redondeo(totalizado, 2))
    total_cuenta = totalizado
}




function redondeo(num, decimales) {
    var signo = (num >= 0 ? 1 : -1);
    num = num * signo;
    if (decimales === 0) //con 0 decimales
        return signo * Math.round(num);
    // round(x * 10 ^ decimales)
    num = num.toString().split('e');
    num = Math.round(+(num[0] + 'e' + (num[1] ? (+num[1] + decimales) : decimales)));
    // x * 10 ^ (-decimales)
    num = num.toString().split('e');
    return signo * (num[0] + 'e' + (num[1] ? (+num[1] - decimales) : -decimales));
}