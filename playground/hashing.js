const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var password = '123abc!';

// bcrypt.genSalt(10, (err, salt) => {
//     bcrypt.hash(password, salt, (err, hash) => {
//         console.log(hash);
//     });
// });

var hashes = [
    '$2a$10$2oqBvUcEj49s2QgNWJkIc.xnWPIiVG6CQrA6l/B6.3942q.E9Mjse',
    '$2a$10$2/HG.5wj2sf.098iNhmhXehKHOMtGCmuxx9yA1yYPQJWZWvajffo.',
    '$2a$10$CfmUA1rrDsaZxwlNuV/ayOZEfecYwI/LXOJUEmTOJn8ulO.UonhVS'
];

hashes.forEach( (hash) => {
    bcrypt.compare(password, hash, (err, res) => {
        console.log(res);
    });
});
// var data = {
//     id: 10
// }

// var token = jwt.sign(data, '123abc');
// console.log(token);

// var verify = jwt.verify(token, '123abc');
// console.log(verify);

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