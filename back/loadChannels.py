import sys,json
from pymongo import MongoClient
try:
    data=json.loads(sys.argv[1])
    client = MongoClient("mongodb://"+str(data[0])+":"+str(data[1]))
    db=client[str(data[2])]
    names=db.collection_names()
except:
    print "error"
    sys.exit(-1)
print json.dumps(names)