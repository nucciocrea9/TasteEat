import boto3
import json
import os
import uuid
from datetime import datetime, timedelta




def lambda_handler(event, context):

    recordId = str(uuid.uuid4())
    date_format='%d/%m/%Y'
    date_format1='%A'
   
    day= (datetime.now()+timedelta(days=1)).strftime(date_format1)
    orderTimestamp= (datetime.now()+timedelta(days=0)).strftime(date_format)
    expiration= (datetime.now()+timedelta(days=2)).strftime(date_format)
    name= event["queryStringParameters"]['name']
    user= event['requestContext']['authorizer']['claims']['email']
    price= event["queryStringParameters"]['price']
    
    #Creating new record in DynamoDB table
    dynamodb = boto3.resource('dynamodb')
    table_name=os.environ['table']
    table = dynamodb.Table(table_name)
    put_item=table.put_item(
        Item={
            'order_id' : recordId,
            'user' : user,
            'name' : name,
            'time' : day,
            'timestamp': orderTimestamp,
            'expiration': expiration,
            'price': price,
        }
    )
    
    response = {
        'headers': {
          
         "Access-Control-Allow-Origin": "*"
    },
        "statusCode": 200,
        "body": json.dumps(put_item)
    }

    return response
    