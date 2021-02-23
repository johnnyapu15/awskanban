const AWS = require("aws-sdk");

const documentClient = new AWS.DynamoDB.DocumentClient( {

});


const tableName = 'Cards';
exports.handler = async (event) => {
    // TODO implement
    console.log(event);
    let response = '';
    let card = JSON.parse(event.body);
    let id = event.pathParameters.id;
    var params = {
        TableName: tableName,
        Key: { id : id },
        UpdateExpression: 'set #c = :c, #t = :t',
        ExpressionAttributeNames: {'#c' : 'category', '#t':'title'},
        ExpressionAttributeValues: {
            ':c' : card.category,
            ':t' : card.title,
        }
    }
    try {
        await documentClient.update(params).promise();
        var ret = {
            id: id
        }
        response = {
            statusCode: 200,
            body: JSON.stringify(ret),
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Authorization'
            }
        };
    } catch (err) {
        console.log("ERR", err);
        response = {
            statusCode: 500,
            body: JSON.stringify({'Message': err}),
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Authorization'
            }
        }
    }
    
    return response;
};
