const {ObjectId} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user')

// Todo.remove({})

// Todo.remove({}).then( (res) => {
//     console.log(res);
// });

// Todo.finOneAndRemove()

// Todo.findByIdAndRemove()

Todo.findByIdAndRemove('abc').then( doc => console.log(doc));