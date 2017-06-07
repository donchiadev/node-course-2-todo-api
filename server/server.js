var express = require('express');
var bodyParser = require('body-parser');

var {ObjectId} = require('mongodb');
var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var port = process.env.PORT || 3000;
var app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    var newTodo = new Todo({
        text: req.body.text
    });
    newTodo.save( (err, doc) => {
        if (err) {
            res.status(400).send(`ERROR: ${err}`);
        } else { 
            res.status(200).send(doc);
        }
    });
    
});

app.get('/todos', (req, res) => {
    Todo.find({}, (err, docs) => {
        if (err) {
            res.status(400).send(err);
        } else {
            res.send({
                todos: docs,
            });
        };
    });
});

app.get('/todos/:id', (req, res) => {
    if (!ObjectId.isValid(req.params.id)) {
        res.status(404).send({});
    } else {
        Todo.findById(req.params.id).then( (todo) => {
            if (!todo) {
                return res.status(404).send({});    
            } else {
                res.send({todo})
            };
            
        }).catch( (e) => {
            res.status(400).send({});
        });
    };
});

app.listen(port, () => {
    console.log(`Started on Port: ${port}`)
});

module.exports = {app};