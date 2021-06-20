from sqlalchemy import Table, Column, Integer, ForeignKey, Boolean, DateTime, String, Text, Float
from sqlalchemy.orm import relationship, backref
from shop.main import db
from datetime import datetime

class Cliente(db.Model):
    __tablename__ = 'clientes'
    dni = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    phone = Column(Integer, primary_key=True)
    deuda = Column(Float, nullable=False)
    compras = Column(String, nullable=True)

    def setDni(self,dni):
        self.dni = int(dni)

    def setCompras(self,compras):
        self.compras = compras
    
    def setName(self,name):
        self.name = name

    def setPhone(self,phone):
        self.phone = int(phone)
    
    def setDeuda(self,deuda):
        self.deuda = deuda
    
    def setListaCompras(self,lista):
        self.compras = lista

class Articulo(db.Model):
    __tablename__ = 'articulos'
    barcode = Column(Integer, primary_key=True, nullable=False)
    name = Column(String, nullable=False)
    price = Column(Float, nullable=False)
    cantidad_en_negocio = Column(Integer,default=0)

    def setBarcode(self,barcode):
        self.barcode = barcode
        db.session.commit()

    def setName(self,newName):
        self.name = newName
        db.session.commit()
    
    def setPrice(self,newPrice):
        self.price = newPrice

class Log(db.Model):
    __tablename__ = 'logs'
    id = Column(Integer,autoincrement=True,nullable=False,primary_key=True)
    content = Column(String, nullable=False)
    created = Column(DateTime, default=datetime.now)