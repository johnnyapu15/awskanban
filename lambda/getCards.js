const AWS = require("aws-sdk");

const documentClient = new AWS.DynamoDB.DocumentClient( {

});


const tableName = 'Cards';
var params = {
    TableName: tableName 
}
exports.handler = async (event) => {
    // TODO implement
    let response = '';
    try {
        const data = await documentClient.scan(params).promise();
        console.log(data)
        response = {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(data),
            
        };
    } catch (err) {
        console.log("ERR", err);
        response = {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({'Message': err}),
            
        }
    }
    
    return response;
};
