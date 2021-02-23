const AWS = require("aws-sdk");

const documentClient = new AWS.DynamoDB.DocumentClient( {

});



exports.handler = async (event) => {
    // TODO implement
    let response = '';
    const id = event.requestContext.requestId; // use requestId as uuid.
    let card = JSON.parse(event.body);
    card.id = id;

    var params = {
        TableName: 'Cards',
        Item: {
            id: id,
            title: card.title,
            category: card.category
        }
    }
    try {
        await documentClient.put(params).promise();
        var ret = {
            id:id
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
