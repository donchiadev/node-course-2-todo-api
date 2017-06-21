const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');

var data = {
    id: 10
}

var token = jwt.sign(data, '123abc');
console.log(token);

var verify = jwt.verify(token, '123abc');
console.log(verify);

// var message = 'I am user number 3';

// var hash = SHA256(message);

// //console.log(`Messagge: ${message}`);
// //console.log(`Hash: ${hash}`);

// var data = {
//     id: 4
// }

// var token = {
//     data: data,
//     hash: SHA256(JSON.stringify(data)).toString()
// };

// token.data.id = 5;
// token.hash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();

// var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();

// if (resultHash === token.hash) {
//     console.log('Data was not changed.');
// } else {
//     console.log('Data was changed don\'t trust.')
// };