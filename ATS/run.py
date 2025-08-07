from app.__init__ import create_app
from asgiref.wsgi import WsgiToAsgi

app = create_app()



if __name__ == "__main__":
    app.run(debug=True, port=5000)
