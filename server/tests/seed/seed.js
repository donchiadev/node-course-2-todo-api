const {ObjectId} = require('mongodb');
const {Todo} = require('../../models/todo.js');
const {User} = require('../../models/user.js');
const jwt = require('jsonwebtoken');

var userOneId = new ObjectId();
var userTwoId = new ObjectId();

const users = [
    {
        _id : userOneId,
        email: "user1@email.com",
        password: 'user1password',
        tokens: [
            {
                access: 'auth',
                token: jwt.sign({_id: userOneId.toHexString(), access: 'auth'}, '123abc').toString()
            }
        ]
    },
    {
        _id : userTwoId,
        email: "user2@email.com",
        password: 'user2password',
        tokens: [
            {
                access: 'auth',
                token: jwt.sign({_id: userTwoId.toHexString(), access: 'auth'}, '123abc').toString()
            }
        ]
    },  
]

const todos = [{
    _id: new ObjectId(),
    text: 'First test todo',
    _creator: userOneId
},{
    _id: new ObjectId(),
    text: 'Second test todo',
    _creator: userTwoId,
    completed: false,
    completedAt: null
}];

const populateTodos = (done) => {
    Todo.remove({}).then( () => {
        return Todo.insertMany(todos);
    }).then( () => done());
};

const populateUsers = (done) => {
    User.remove({}).then( () => {
        var userOne = new User(users[0]).save();
        var userTwo = new User(users[1]).save();
        return Promise.all([userOne, userTwo]);
    }).then( () => done());
};

module.exports = {todos, populateTodos, users, populateUsers};