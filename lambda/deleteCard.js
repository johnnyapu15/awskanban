const AWS = require("aws-sdk");

const documentClient = new AWS.DynamoDB.DocumentClient( {

});

const tableName = 'Cards';
exports.handler = async (event) => {
    // TODO implement
    let response = '';
    let id = event.pathParameters.id;
    var params = {
        TableName: tableName,
        Key: { id : id },
    }
    try {
        await documentClient.delete(params).promise();
        var ret = {
            id: id
        }
        response = {
            statusCode: 200,
            body: JSON.stringify(ret),
            headers: {
                'Access-Control-Allow-Origin': '*'
            }
        };
    } catch (err) {
        console.log("ERR", err);
        response = {
            statusCode: 500,
            body: JSON.stringify({'Message': err}),
            headers: {
                'Access-Control-Allow-Origin': '*'
            }
        }
    }
    
    return response;
};
