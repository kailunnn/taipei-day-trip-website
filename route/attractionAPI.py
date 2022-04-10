from flask import *

# 匯入 dbconfig
import config.dbConfig as cnx
from mysql.connector import Error

attractionAPI = Blueprint('attractionAPI', __name__)

# 資料庫操作
def sqlOperate(sql, value, action):
        try:
            db = cnx.cnxpool.get_connection()
            cursor = db.cursor()
            cursor.execute(sql, value)

            if(action == 'READ'):
                result = cursor.fetchone()
            elif(action == 'READ MANY'):
                result = cursor.fetchall()
            else:
                db.commit()
                result = 'success' 

        except Error as e:
            print(e)
            result = 'error'

        finally:
            if db.in_transaction:
                db.rollback()
            cursor.close()
            db.close()
        
        return result


@attractionAPI.route('/api/attractions')
def apiAttractions():
    try:
        page = request.args.get('page')
        keyword = request.args.get('keyword') # 沒有值為 none
        
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
            attractionCount = sqlOperate('SELECT COUNT(*) FROM `attractions`', None, 'READ')
            count = attractionCount[0]
            #有資料：[(...),(...)] 沒資料：[]
            attractions = sqlOperate('SELECT * FROM `attractions` ORDER BY `id` LIMIT %s,%s', (i-1, 12), 'READ MANY')
            
        # 有頁數且有關鍵字
        else:
            attractionCount = sqlOperate('SELECT COUNT(*) FROM `attractions` WHERE `title` LIKE "%%%s%%"' %keyword, None, 'READ')
            count = attractionCount[0]

            sql = "SELECT * FROM `attractions` WHERE `title` LIKE '%%%s%%' ORDER BY `id` LIMIT %s,%s" %(keyword, i-1, 12)
            attractions = sqlOperate(sql, None, 'READ MANY')
        
        # 組合 response
        if(page <= (count/12)-1):
            nextPage = page+1
        else:
            nextPage = None

        code = 200
        infos = []
        data = {
            "nextPage": nextPage,
            "data": infos
        }
        
        for item in attractions: 
            # 圖片存成陣列
            pictures = []
            imgs = item[9]
            img = imgs.split('https')
            img.pop(0)
            for url in img:
                wholeUrl = 'https' + url
                pictures.append(wholeUrl)
                
            info = {
                "id": item[0],
                "name": item[1],
                "category": item[2],
                "description": item[6],
                "address": item[3],
                "transport": item[7],
                "mrt": item[8],
                "latitude": item[5],
                "longtitude": item[4],
                "images": pictures
            }
            infos.append(info)
        
    except Error as e:
        print(e)
        code = 500
        data = {
                "error": True,
                "message": "伺服器內部錯誤"
        }
    
    return jsonify(data),code



@attractionAPI.route("/api/attraction/<attractionId>")
def apiAttractionId(attractionId):
    try:
        attraction = sqlOperate('SELECT * FROM `attractions` WHERE `id` = %s', (attractionId,), 'READ')
        if(attraction):
            # 圖片存成陣列
            pictures = []
            imgs = attraction[9]
            img = imgs.split('https')
            img.pop(0)
            for url in img:
                wholeUrl = 'https' + url
                pictures.append(wholeUrl)
                
            code = 200
            data = {
                "data":{
                    "id": attraction[0],
                    "name": attraction[1],
                    "category": attraction[2],
                    "description": attraction[6],
                    "address": attraction[3],
                    "transport": attraction[7],
                    "mrt": attraction[8],
                    "latitude": attraction[5],
                    "longtitude": attraction[4],
                    "images": pictures
                }
            }
        else:
            code =400
            data = {
                "error": True,
                "message": "無此景點編號"
            }

    except Error as e:
        print(e)
        code = 500
        data = {
                "error": True,
                "message": "伺服器內部錯誤"
        }
    
    return jsonify(data),code
    