import requests

headers = {'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1AbS5jb20iLCJuYW1lIjoiTWFuaXNoIiwiaWF0IjoxNTU1OTUzMzQzLCJleHAiOjE1NTU5NzQ5NDN9.FjXPZ_W99ynaH2RIeLdMtaF_5dlEl5EyeuuQaQk0ak4',
           'content-type': 'application/json'}

url1 = 'http://localhost:8000/api/executiveViewIntents'
url2 = 'http://localhost:8000/api/executiveGetIntentInfo'
url3 = 'http://localhost:8000/api/executiveGetUntrainedIntents'
url4 = 'http://localhost:8000/api/executiveGetProfile'
url5 = 'http://localhost:8000/api/executiveUpdatePassword'

req2 = {'intentName': 'hello_two'}
req3 = {'PageNumber': 1}
req4 = {'Email': 'm@m.com'}
req5 = {'Email': 'm@m.com', 'OldPassword': '2', 'NewPassword': '1'}

while True:
    r1 = requests.get(url1, headers = headers)
    data1 = r1.json()
    print(data1)
    
    r2 = requests.post(url2, json = req2, headers = headers)
    data2 = r2.json()
    print(data2)
    
    r3 = requests.post(url3, json = req3, headers = headers)
    data3 = r3.json()
    print(data3)
    
    r4 = requests.post(url4, json = req4, headers = headers)
    data4 = r4.json()
    print(data4)
    
    r5 = requests.post(url5, json = req5, headers = headers)
    data5 = r5.json()
    print(data5)
    
"""
while True:
    r1 = requests.post('https://localhost:4250', verify=False)
    data1 = r1.json()
    print(data1)"""