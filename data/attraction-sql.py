import json
import mysql.connector
db = mysql.connector.connect(
    host='localhost',
    user='root',
    password='0000',
    database='tourist_attraction')
cursor = db.cursor()

with open("./data/taipei-attractions.json", mode="r", encoding="utf-8") as file:
    data = json.load(file)
datas = data["result"]["results"]
# print(datas)

# 處理圖片
photos = []
for item in datas:
    pictures = item["file"]
    picture = pictures.split('https')
    wholeUrl=""
    for pic in picture:
        url = pic.lower()
        if(url.endswith('jpg') or url.endswith('png')):
            txt = "https" + pic
            wholeUrl += txt
    photos.append(wholeUrl)
# print(len(photos))

# 處理放進資料庫的資料
n = 0
for item in datas:
    siteId = item["_id"]
    title = item["stitle"]
    category = item["CAT2"]
    address = item["address"]
    longtitude = item["longitude"]
    latitude = item["latitude"]
    description = item["xbody"]
    transport = item["info"]
    mrt = item["MRT"]
    photoUrl = photos[n]
    n+=1
    # 將資料存進資料庫
    sql = "INSERT INTO `attractions` (id, title, category, address, longtitude, latitude, description, transport, mrt, photoUrl) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"
    value = (siteId, title, category, address, longtitude, latitude, description, transport, mrt, photoUrl)
    cursor.execute(sql, value)
    db.commit()

cursor.close()
db.close()







