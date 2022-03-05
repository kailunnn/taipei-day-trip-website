from flask import *
app=Flask(__name__)
app.config["JSON_AS_ASCII"]=False
app.config["TEMPLATES_AUTO_RELOAD"]=True

import mysql.connector
db = mysql.connector.connect(
    host='localhost',
    user='root',
    password='0000',
    database='tourist_attraction')
cursor = db.cursor()

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

@app.route("/api/attractions")
def apiAttractions():
	page = request.args.get("page")
	keyword = request.args.get("keyword") # 沒有值為 none

	# 依照 page 的數字，找出從第 i 筆開始
	if(page == None or page == 0):
		if(page == None):
			page = 0
		i = 1
	else:
		page = int(page)
		i = page * 12 + 1
	
	# 有頁數但沒有關鍵字
	if(keyword == None):
		sqlCount = "SELECT COUNT(*) FROM `attractions`"
		cursor.execute(sqlCount,)
		count = cursor.fetchone()[0]
		sql = "SELECT * FROM `attractions` ORDER BY `id` LIMIT %s,%s"
		value = (i-1, 12)	
		cursor.execute(sql, value)
		result = cursor.fetchall() #有資料：[(...),(...)] 沒資料：[]
	# 有頁數且有關鍵字
	elif(keyword):
		sqlCount = "SELECT COUNT(*) FROM `attractions` WHERE `title` LIKE '%%%s%%'" %keyword
		cursor.execute(sqlCount,)
		count = cursor.fetchone()[0]
		sql = "SELECT * FROM `attractions` WHERE `title` LIKE '%%%s%%' ORDER BY `id` LIMIT %s,%s" %(keyword, i-1, 12)
		cursor.execute(sql)
		result = cursor.fetchall()
	else:
		info = {
			"error": True,
			"message": "伺服器內部錯誤"
		}
		return jsonify(info),500

	# 組合 response
	if(page <= (count/12)-1):
		nextPage = page+1
	else:
		nextPage = None

	data = []	
	infos = {
		"nextPage": nextPage,
		"data": data
	}
	
	for item in result: 
		# 圖片存成陣列
		pictures = []
		imgs = item[9]
		img = imgs.split('https')
		img.pop(0)
		for url in img:
			wholeUrl = "https" + url
			pictures.append(wholeUrl)

		info = {
			"id": item[0],
			"name": item[1],
			"category": item[2],
			"description": item[6],
			"address": item[3],
			"transport":item[7],
			"mrt":item[8],
			"latitude": item[5],
			"longtitude": item[4],
			"images": pictures
		}
		data.append(info)
	return jsonify(infos)

@app.route("/api/attraction/<attractionId>")
def apiAttractionId(attractionId):
	sql = "SELECT * FROM `attractions` WHERE `id` = %s"
	value = (attractionId,)
	cursor.execute(sql, value)
	result = cursor.fetchone() # 有資料：(...,...,...) 沒資料：None
	
	if(result):
		# 圖片存成陣列
		pictures = []
		imgs = result[9]
		img = imgs.split('https')
		img.pop(0)
		for url in img:
			wholeUrl = "https" + url
			pictures.append(wholeUrl)

		info = {
			"data":{
				"id": result[0],
				"name": result[1],
				"category": result[2],
				"description": result[6],
				"address": result[3],
				"transport": result[7],
				"mrt": result[8],
				"latitude": result[5],
				"longtitude": result[4],
				"images": pictures
			}
		}
		return jsonify(info)
	elif(result == None):
		info = {
			"error": True,
			"message": "無此景點編號"
		}
		return jsonify(info),400
	else:
		info = {
			"error": True,
			"message": "伺服器內部問題"
		}
		return jsonify(info),500



app.run(port=3000)
cursor.close()
db.close()