# production.wsgi
import sys
 
sys.path.insert(0,"/var/www/html/taipei-day-trip-website/")
 
from app import app as application