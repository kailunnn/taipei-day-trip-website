from flask import *
import json
import urllib.request as req

from datetime import datetime 

# 匯入 dbconfig
import config.dbConfig as cnx
from mysql.connector import Error

orderAPI = Blueprint('orderAPI', __name__)

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

@orderAPI.route("/api/orders", methods = ['GET', 'POST'])
def orders():
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
    
    # 建立新的訂單，並完成付款程序
    if request.method == 'POST':

        try:
            data = json.loads(request.get_data())
            prime = data["prime"]
            attractionId = data["order"]["trip"]["attraction"]["id"]
            contactName = data["order"]["contact"]["name"]
            contactEmail = data["order"]["contact"]["email"]
            contactPhone = data["order"]["contact"]["phone"]
            itinararyTitle = data["order"]["trip"]["attraction"]["name"]
            itinararyDate = data["order"]["trip"]["date"]
            itinararyTime = data["order"]["trip"]["time"]
            itinararyPrice = data["order"]["price"]

            # 建立訂單編號
            def lastStr(str):
                if(len(str) < 2):
                    str = str.rjust(2, "0")
                else:
                    str =  str[-2:]
                return str
            # 時間戳
            ts = datetime.now().timestamp() * 1000
            ts = str(ts).split(".")[0]
            # 取會員 id 後兩碼
            memberIdLast = lastStr(str(memberId))
            # 取訂單 id 後兩碼
            attractionIdLast = lastStr(str(attractionId))
            trackingNumber = ts + memberIdLast + attractionIdLast


            # 建立訂單，狀態為未付款
            sql = "INSERT INTO `orders` (tracking_number, memberId, attractionId, status, contact_name, contact_email, contact_phone, itinarary_date, itinarary_time, itinarary_price) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"
            value = (trackingNumber, memberId, attractionId, "未付款", contactName, contactEmail, contactPhone, itinararyDate, itinararyTime, itinararyPrice)
            action = "CREATE"
            createOrder = sqlOperate(sql, value, action)
            if(createOrder == 'error'):
                return jsonify({ "error": True, "message": "建立失敗"}),400
            
            # 刪除購物車
            deleteCart = sqlOperate("DELETE FROM `carts` WHERE `memberId` = %s", (memberId,), "DELETE")

            # 呼叫 TapPay 的付款 API，完成付款動作
            tappayUrl = "https://sandbox.tappaysdk.com/tpc/payment/pay-by-prime"
            tappayHeaders = {
                'Content-Type': 'application/json',
                'x-api-key': 'partner_yAK8D2LVpIUhEYTlXqzvMf07YlAAr4NiQeW2arsghSlXr3FHuJtB4Bgv'
            }
            requestData = {
                "prime": prime,
                "partner_key": "partner_yAK8D2LVpIUhEYTlXqzvMf07YlAAr4NiQeW2arsghSlXr3FHuJtB4Bgv",
                "merchant_id": "kailunnn_CTBC",
                "details": "Tappay Test",
                "amount": itinararyPrice,
                "cardholder": {
                    "phone_number": contactPhone,
                    "name": contactName,
                    "email": contactEmail,
                    "zip_code": "100",
                    "address": "台北市天龍區芝麻街1號1樓",
                    "national_id": "A123456789"
                },
                "remember": True
            }

            tappayRequest = req.Request(
                tappayUrl, 
                headers = tappayHeaders, 
                data=json.dumps(requestData).encode('utf-8')
            )

            with req.urlopen(tappayRequest) as response:
                tappayData = json.load(response)

            # 付款成功，status = 0
            if(tappayData["status"] == 0):
                # 修改訂單狀態為已付款
                sql = "UPDATE `orders` SET `status`= '已付款'  WHERE `tracking_number`= %s"
                value = (trackingNumber,)
                action = "UPDATE"
                updateOrder = sqlOperate(sql, value, action)
                if(updateOrder == 'error'):
                    return jsonify({ "error": True, "message": "建立失敗"}),400

                status = tappayData["status"]
                message = "付款成功"
            else:
                status = tappayData["status"]
                message = tappayData["msg"]
            
            code = 200
            data = {
                "data": {
                    "number": trackingNumber,
                    "payment": {
                        "status": status,
                        "message": message
                    }
                }
            }

        except Error as e:
            print(e)
            code = 500
            data = {
                    "error": True,
                    "message": "伺服器內部錯誤"
            }
        
        return jsonify(data),code

    # 根據訂單編號，取得訂單資訊
    elif request.method == 'GET':

        try:
            trackingNumber = request.args.get("number")
            getOrder = sqlOperate("SELECT * FROM `orders` WHERE `tracking_number` = %s", (trackingNumber,), "READ")
            # ('16493200895410345', 3, 45, '已付款', '小黃', 'yellow@gmail.com', '4348013', datetime.date(2022, 4, 20), 'morning', 2000)

            if(getOrder):
                getAttraction = sqlOperate("SELECT * FROM `attractions` WHERE `id` = %s", (getOrder[2],), "READ")
                
                # 處理時間格式
                dateFormate = getOrder[7].strftime("%Y-%m-%d")
                # 處理 status
                if(getOrder[3] == "已付款"):
                    status = 0
                else:
                    status = 1
                # 處理圖片
                image = getAttraction[9].split("https")[1]
                image = "https" + image

                code = 200
                data = {
                    "data": {
                        "number": trackingNumber,
                        "price": getOrder[9],
                        "trip": {
                            "attraction": {
                                "id": getAttraction[0],
                                "name": getAttraction[1],
                                "address": getAttraction[3],
                                "image": image
                            },
                            "date": dateFormate,
                            "time": getOrder[8]
                        },
                        "contact": {
                            "name": getOrder[4],
                            "email": getOrder[5],
                            "phone": getOrder[6]
                        },
                        "status": status
                    }
                }
            
            else:
                code = 200
                data = {
                    "data": None
                }
        
        except Error as e:
            print(e)
            code = 500
            data = {
                    "error": True,
                    "message": "伺服器內部錯誤"
            }

        return jsonify(data),code