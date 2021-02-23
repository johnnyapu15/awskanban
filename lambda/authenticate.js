// 아래 SECRET_KEY를 이용해 토큰을 검증하는 모듈.

const crypto = require("crypto");
const SECRET_KEY = "SECRETTO";
const algo = "TEST_ALGO"
var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/\r\n/g,"\n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}

exports.handler = async (event, cxt, callback) => {
    
    try{
        console.log(event)
        var auth = event.headers.authorization // "Bearer JWT"
        console.log(auth)
        var token = auth.split(' ')[1]; // JWT. "algo.claim.sig"
        
        // all claim obj is just {"id":"admin", "role":"admin"}
        var spl = token.split('.')
        var decoded = Base64.decode(spl[1])
        console.log(decoded)
        var claim = JSON.parse(decoded)
        if (claim.role !== "admin") throw new Error()
        if (claim.ts < Date.now()) throw new Error() // 10 min TIMEOUT
        
        var sig = spl[2]
        const seed = JSON.stringify(claim) + SECRET_KEY
        const sha = crypto.createHash('sha1')
        const shad = sha.update(seed).digest('hex')
        if (sig !== shad) throw new Error()
        
        callback(null, generateAllow('me', event.methodArn));
    }
    catch (e) {
        console.log(e)
        callback("Unauthorized");
    }
};

// Help function to generate an IAM policy
var generatePolicy = function(principalId, effect, resource) {
    // Required output:
    var authResponse = {};
    authResponse.principalId = principalId;
    if (effect && resource) {
        var policyDocument = {};
        policyDocument.Version = '2012-10-17'; // default version
        policyDocument.Statement = [];
        var statementOne = {};
        statementOne.Action = 'execute-api:Invoke'; // default action
        statementOne.Effect = effect;
        statementOne.Resource = resource;
        policyDocument.Statement[0] = statementOne;
        authResponse.policyDocument = policyDocument;
    }
    // Optional output with custom properties of the String, Number or Boolean type.
    authResponse.context = {
        "stringKey": "stringval",
        "numberKey": 123,
        "booleanKey": true
    };
    return authResponse;
    
    
    
}
     
var generateAllow = function(principalId, resource) {
    return generatePolicy(principalId, 'Allow', resource);
}
     
var generateDeny = function(principalId, resource) {
    return generatePolicy(principalId, 'Deny', resource);
}