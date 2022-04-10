from flask import *
import json

# 匯入 dbconfig
import config.dbConfig as cnx
from mysql.connector import Error

memberAPI = Blueprint('memberAPI', __name__)

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


@memberAPI.route("/api/user", methods = ['GET', 'POST', 'PATCH', 'DELETE'])
def memberStatus():
    
    # 註冊一個新的使用者
    if request.method == 'POST':
        try:
            name = json.loads(request.get_data())["name"]
            email = json.loads(request.get_data())["email"]
            password = json.loads(request.get_data())["password"]
            # 查看此 email 是否已經存在
            hadEmail = sqlOperate('SELECT * FROM `member` WHERE `email` = %s', (email,), 'READ') 
            # 如果有資料代表已經存在，如果 none 代表帳號尚未被使用
            if(hadEmail):
                code = 400
                data = {
                    "error": True,
                    "message": "此帳號已被註冊"
                }
            else:
                sql = 'INSERT INTO `member` (name, email, password) VALUES (%s, %s, %s)'
                value = (name, email, password)
                createAccount = sqlOperate(sql, value, 'CREATE')
                code = 200
                data = {"ok": True}

        except Error as e:
            print(e)
            code = 500
            data = {
                    "error": True,
                    "message": "伺服器內部錯誤"
            }

    # 登入使用者帳戶
    elif request.method == 'PATCH':
        try:
            email = json.loads(request.get_data())["email"]
            password = json.loads(request.get_data())["password"]

            sql = 'SELECT * FROM `member` WHERE `email` = %s and `password` = %s'
            value = (email, password)
            loginCheak = sqlOperate(sql, value, 'READ')
            
            if(loginCheak):
                session["userEmail"] = loginCheak[2]

                code = 200
                data = {"ok": True}
            else:
                code = 400
                data = {
                    "error": True,
                    "message": "帳號或密碼輸入錯誤"
                }

        except Error as e:
            print(e)
            code = 500
            data = {
                    "error": True,
                    "message": "伺服器內部錯誤"
            }
        
    # 取得當前登入的使用者資訊
    elif request.method == 'GET':
        try:
            if "userEmail" in session:
                email = session["userEmail"]
                getUserInfo = sqlOperate('SELECT * FROM `member` WHERE `email` = %s', (email,), 'READ')
                code = 200
                data = {
                    "data": {
                        "id": getUserInfo[0],
                        "name": getUserInfo[1],
                        "email": getUserInfo[2]
                    }
                }
            # 未登入
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
        
    # 登出使用者帳戶
    elif request.method == 'DELETE':
        del session["userEmail"]
        code = 200
        data = { "ok": True }
    
    return jsonify(data),code

        
        

