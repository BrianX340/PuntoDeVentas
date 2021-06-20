from flask import Flask, render_template, request, redirect, jsonify, make_response
from flask_sqlalchemy import SQLAlchemy
import hashlib
import os
import json

app = Flask(__name__)
app.config.from_object('shop.config')
app.config['SECRET_KEY'] = 'A0Zr98j/3yX R~XHH!jmN]LWX/,?RT'
db = SQLAlchemy(app)

@app.route("/inicio")
def inicio():
    return render_template('inicio.html')

@app.route("/agregar-clientes")
def agregar_clientes_page():
    return render_template('agregar-clientes.html')

@app.route("/agregar-articulos")
def agregar_articulos_page():
    return render_template('agregar-articulos.html')
"""
@app.route("/add-clientes", methods=["POST"])
def add_clientes():
    from shop.models import Cliente

    req = request.get_json()

    name = str(req['name'])
    dni = str(req['dni'])
    phone = str(req['phone'])
    cliente = Cliente()
    cliente.setName(name)
    cliente.setDni(int(dni))
    cliente.setPhone(int(phone))
    cliente.setDeuda(float(0.0))
    cliente.setCompras(json.dump({}))
    db.session.add(cliente)
    db.session.commit()
    return make_response(jsonify({"OK": "YES",
                                    'name':name,
                                    'dni':dni,
                                    'phone':phone,
                                    'deuda':cliente.deuda}), 200)
"""
@app.route("/add-clientes", methods=["POST"])
def add_clientes():
    return make_response(jsonify({"OK": "funca"}), 200)


@app.route("/add-articulos", methods=["POST"])
def add_articles():
    from shop.models import Articulo
    from shop.models import Log

    req = request.get_json()

    barcode = str(req['barcode'])
    name = str(req['name'])
    price = str(req['price'])
    print(barcode,name,price)

    try:
        article = Articulo.query.filter_by(barcode=barcode).first()
        article.setName(name)
        article.setPrice(float(price))
        db.session.add(article)
        db.session.commit()

        return make_response(jsonify({"OK": "EXIST",
                                        'name':name,
                                        'barcode':barcode,
                                        'price':price}), 200)
    except:
        article = Articulo()
        article.setName(name)
        article.setPrice(float(price))
        article.setBarcode(int(barcode))
        db.session.add(article)
        db.session.commit()
        return make_response(jsonify({"OK": "YES",
                                        'name':name,
                                        'barcode':barcode,
                                        'price':price}), 200)

@app.route("/consulta-barcode", methods=["POST"])
def consulta_barcode():
    from shop.models import Articulo

    req = request.get_json()
    barcode = int(req['barcode'])
    try:
        articulo = Articulo.query.filter_by(barcode=barcode).first()
        item = {
            'response':'OK',
            'name':articulo.name,
            'price':articulo.price
        }
        return make_response(jsonify(item), 200)
    except:
        return make_response(jsonify({'response':'error'}), 200)



@app.route("/add-client", methods=["POST"])
def add_client():
    from shop.models import Cliente

    req = request.get_json()
    name = req['name']
    dni = req['dni']
    phone = req['phone']
    user = Cliente.query.filter_by(dni=dni).first()

    if user:
        return make_response(jsonify({"OK": "EXIST",
                                        "name":name,
                                        "dni":dni,
                                        "phone":phone
        }), 200)
    else:
        user = Cliente()
        user.setName(name)
        user.setDni(dni)
        user.setPhone(phone)
        user.setDeuda(0)
        user.setCompras('[]')
        db.session.add(user)
        db.session.commit()
        return make_response(jsonify({"OK":"YES",
                                    "name":name,
                                    "dni":dni,
                                    "phone":phone
        }),200)