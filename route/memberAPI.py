from flask import *
import json

# 匯入 dbconfig
import config.dbConfig as cnx
from mysql.connector import Error

memberAPI = Blueprint('memberAPI', __name__)


@memberAPI.route("/api/user", methods = ['GET', 'POST', 'PATCH', 'DELETE'])
def memberStatus():
    # 註冊一個新的使用者
    if request.method == 'POST':
        name = json.loads(request.get_data())["name"]
        email = json.loads(request.get_data())["email"]
        password = json.loads(request.get_data())["password"]
        # 查看此 email 是否已經存在
        try:
            db = cnx.cnxpool.get_connection()
            cursor = db.cursor()
            sql = "SELECT * FROM `member` WHERE `email` = %s"
            value = (email,)
            cursor.execute(sql, value)
            result = cursor.fetchone()
            # print(result)
        except Error as e:
            print(e)
        finally:
            if db.in_transaction:
                db.rollback()
            cursor.close()
            db.close()
        # 如果有資料代表已經存在，如果 none 代表帳號尚未被使用
        if(result):
            data = {
                "error": True,
                "message": "此帳號已被註冊"
            }
        elif(result == None):
            try:
                db = cnx.cnxpool.get_connection()
                cursor = db.cursor()
                insertSql = "INSERT INTO `member` (name, email, password) VALUES (%s, %s, %s)"
                insertValue = (name, email, password)
                cursor.execute(insertSql, insertValue)
                db.commit()
                # session["userEmail"] = email
            except Error as e:
                print(e)
            finally:
                if db.in_transaction:
                    db.rollback()
                cursor.close()
                db.close()
            
            data = {"ok": True}
        else:
            data = {
                "error": true,
                "message": "伺服器內部錯誤"
            }

    # 登入使用者帳戶
    elif request.method == 'PATCH':
        email = json.loads(request.get_data())["email"]
        password = json.loads(request.get_data())["password"]
        try:
            db = cnx.cnxpool.get_connection()
            cursor = db.cursor()
            sql = "SELECT * FROM `member` WHERE `email` = %s and `password` = %s"
            value = (email, password)
            cursor.execute(sql, value)
            result = cursor.fetchone()
            # print(result)
        except Error as e:
                print(e)
        finally:
            if db.in_transaction:
                db.rollback()
            cursor.close()
            db.close()
        
        if(result):
            # print(result[2])
            session["userEmail"] = result[2]
            data = {"ok": True}
        elif(result == None):
            data = {
                "error": True,
                "message": "帳號或密碼輸入錯誤"
            }
        else:
            data = {
                "error": True,
                "message": "伺服器內部錯誤"
            }

    # 取得當前登入的使用者資訊
    elif request.method == 'GET':
        if "userEmail" in session:
            email = session["userEmail"]
            # print(email)
            try:
                db = cnx.cnxpool.get_connection()
                cursor = db.cursor()
                sql = "SELECT * FROM `member` WHERE `email` = %s"
                value = (email,)
                cursor.execute(sql, value)
                result = cursor.fetchone()
                # print(result)
            except Error as e:
                print(e)
            finally:
                if db.in_transaction:
                    db.rollback()
                cursor.close()
                db.close()

            data = {
                "data": {
                    "id": result[0],
                    "name": result[1],
                    "email": result[2]
                }
            }
        else:
            data = { "data": None }
        
    # 登出使用者帳戶
    elif request.method == 'DELETE':
        del session["userEmail"]
        data = { "ok": True }
    
    return jsonify(data)

        
        

