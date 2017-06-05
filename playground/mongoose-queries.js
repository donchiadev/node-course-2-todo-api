const {ObjectId} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user')

var id = "592d1460ccf07af020000039";

if(!ObjectId.isValid(id)) {
    console.log('id not valid')
};

// Todo.find({
//     _id : id
// }).then( (todos) => {
//     console.log(todos);
// });

// Todo.findOne({
//     _id: id
// }).then( (todo) => {
//     console.log(todo);
// });

// Todo.findById(id).then( (todo) => {
//     if (!todo) {
//         return console.log('todo not found');
//     };
//     console.log(todo);
// }).catch( (e) => console.log(e));

User.findById(id).then( (user) => {
    if (!user) {
        return console.log('user not found');
    };
    console.log('User', user);
}).catch( (e) => console.log(e));