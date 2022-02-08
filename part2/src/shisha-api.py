import boto3
import json

def lambda_handler(event, context):
    return(Respond(event))


def Respond(res):
    req = res['data']
    requested = {}
    if (req == 'brands'):
        requested = GetBrands()
    if (req == 'flavors'):
        requested = GetFlavors(res['brand'])
    return {
        'statusCode' : 200,
        'body' : json.dumps(requested),
        'headers' : {
            'Content-Type' : 'application/json',
        },
    }

def GetBrands():
    s3 = boto3.resource('s3')
    content_object = s3.Object('shisha-db', 'flavors.json')
    file_content = content_object.get()['Body'].read().decode('utf-8')
    json_content = json.loads(file_content)
    returndata = {}
    i = 0
    for key in json_content.keys():
        returndata[i] = key
        i = i + 1
    return returndata

def GetFlavors(brand):
    s3 = boto3.resource('s3')
    content_object = s3.Object('shisha-db', 'flavors.json')
    file_content = content_object.get()['Body'].read().decode('utf-8')
    json_content = json.loads(file_content)
    returndata = {}
    i = 0
    for key in json_content[brand].keys():
        returndata[key] = json_content[brand][key]
        i = i + 1
    return returndata