from django.shortcuts import render, HttpResponse
from .models import Article

# Create your views here.
def pos(request):
    articulos = Article.objects.all()
    return render(request,'pos/inicio.html', {'articulos':articulos}) #template.pos.inicio.html