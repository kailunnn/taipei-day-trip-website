from flask import *
# 景點 api 藍圖
from route.attractionAPI import attractionAPI
from route.memberAPI import memberAPI
from route.bookingAPI import bookingAPI

app=Flask(__name__)
app.config["JSON_AS_ASCII"]=False
app.config["TEMPLATES_AUTO_RELOAD"]=True
app.secret_key= "1234567890"

app.register_blueprint(attractionAPI)
app.register_blueprint(memberAPI)
app.register_blueprint(bookingAPI)

# Pages
@app.route("/")
def index():
	return render_template("index.html")
@app.route("/attraction/<id>")
def attraction(id):
	return render_template("attraction.html")
@app.route("/booking")
def booking():
	return render_template("booking.html")
@app.route("/thankyou")
def thankyou(): 
	return render_template("thankyou.html")


# app.run('0.0.0.0', port=3000)
app.run('0.0.0.0', port=3000, debug=True)