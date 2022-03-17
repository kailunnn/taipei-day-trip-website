import mysql.connector
from mysql.connector import pooling

# 本機
# dbconfig = {
#     'host' : 'localhost',
#     'user' : 'root',
#     'password' : "0000",
#     'database' : 'tourist_attraction'
# }

# aws
dbconfig = {
    'host' : 'localhost',
    'user' : 'kailun',
    'password' : '0000',
    'database' : 'tourist_attraction'
}

cnxpool = mysql.connector.pooling.MySQLConnectionPool(
    pool_name = "mypool",
    pool_size = 5,
    # Whether to reset session variables when the connection is returned to the pool.
    pool_reset_session = True, 
    # autocommit = True, 
    **dbconfig
)
