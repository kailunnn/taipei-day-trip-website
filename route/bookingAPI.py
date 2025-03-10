from flask import *
import json

# 匯入 dbconfig
import config.dbConfig as cnx
from mysql.connector import Error

bookingAPI = Blueprint('bookingAPI', __name__)

# 資料庫操作
def sqlOperate(sql, value, action):
        try:
            db = cnx.cnxpool.get_connection()
            cursor = db.cursor()
            cursor.execute(sql, value)

            if(action == "READ"):
                result = cursor.fetchone()
            else:
                db.commit()
                result = "success" 

        except Error as e:
            print(e)
            result = "error"

        finally:
            if db.in_transaction:
                db.rollback()
            cursor.close()
            db.close()
        
        return result


@bookingAPI.route("/api/booking", methods = ['GET', 'POST', 'DELETE'])
def booking():

    # 檢查是否登入
    if "userEmail" in session:
        userEmail = session["userEmail"]
    else:
        data = {
            "error": True,
            "message": "未登入系統，拒絕存取"
        }
        return jsonify(data),403
    
    # 找到 member 資料
    memberInfo = sqlOperate("SELECT * FROM `member` WHERE `email` = %s", (userEmail,), "READ")
    memberId = memberInfo[0]
    # 判斷該 member 是否已有預定行程
    hasCart = sqlOperate("SELECT * FROM `carts` WHERE `memberId` = %s", (memberId,), "READ")
    # (2, 3, 20, datetime.date(2022, 1, 31), 'afternoon', 2500)

    
    # 建立新的預定行程
    if request.method == 'POST':

        try:
            attractionId = json.loads(request.get_data())["attractionId"]
            date = json.loads(request.get_data())["date"]
            time = json.loads(request.get_data())["time"]
            price = json.loads(request.get_data())["price"]
            # 如果已有訂單，則更改為新的預定行程
            if(hasCart):
                sql = "UPDATE `carts` SET `attractionId`= %s, `date`= %s, `time`= %s, `price`= %s WHERE `memberId`= %s"
                value = (attractionId, date, time, price, memberId)
                action = "UPDATE"
            # 如果沒有則新增新的預定行程      
            elif(hasCart ==  None):
                sql = "INSERT INTO `carts` (memberId, attractionId, date, time, price) VALUES (%s, %s, %s, %s, %s)"
                value = (memberId, attractionId, date, time, price)
                action = "CREATE"
        
            operateData = sqlOperate(sql, value, action)
            if(operateData == "success"): 
                code = 200
                data = {"ok": True}
            elif(operateData == "error"):
                code = 400
                data = {
                    "error": True,
                    "message": "建立失敗"
                }
        except Error as e:
            print(e)
            code = 500
            data = {
                    "error": True,
                    "message": "伺服器內部錯誤"
            }

        return jsonify(data),code

    # 取得預定行程
    elif request.method == 'GET':
        
        try:
            # 如果有預定行程
            if(hasCart):
                # 處理日期格式
                dateFormate = hasCart[3].strftime("%Y-%m-%d")

                attractionId = hasCart[2]
                attractionInfo = sqlOperate("SELECT * FROM `attractions` WHERE `id` = %s", (attractionId,), "READ")
                # 處理圖片
                images = []
                image = attractionInfo[9].split('https')
                image.pop(0)
                for url in image:
                    wholeUrl = "https" + url
                    images.append(wholeUrl)

                code = 200
                data = {
                    "data": {
                        "attraction":{
                            "id": attractionInfo[0],
                            "name": attractionInfo[1],
                            "address": attractionInfo[3],
                            "image": images[0]
                        },
                        "date": dateFormate,
                        "time": hasCart[4],
                        "price": hasCart[5]
                    }
                }

            else:
                code = 200
                data = { "data": None }

        except Error as e:
            print(e)
            code = 500
            data = {
                    "error": True,
                    "message": "伺服器內部錯誤"
            }

        return jsonify(data),code

    # 刪除預定行程
    elif request.method == 'DELETE':

        try:
            deleteCart = sqlOperate("DELETE FROM `carts` WHERE `memberId` = %s", (memberId,), "DELETE")
            if(deleteCart == "success"): 
                code = 200
                data = {"ok": True}
        except Error as e:
            print(e)
            code = 500
            data = {
                    "error": True,
                    "message": "伺服器內部錯誤"
            }

        return jsonify(data),code
        

        

        

        




