from flask_script import Manager
from shop.main import app, db
from shop.models import Articulo, Log



manager = Manager(app)

app.config['DEBUG'] = True



@manager.command
def create_tables():
	"Create relational database tables."
	db.create_all()	

if __name__ == '__main__':
	manager.run()