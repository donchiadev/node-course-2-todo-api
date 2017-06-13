require('./config/config');

const _ = require("lodash");
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectId} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var port = process.env.PORT;
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
    
    var id = req.params.id;

    if (!ObjectId.isValid(req.params.id)) {
        return res.status(404).send({});
    }
    
    Todo.findById(req.params.id).then( (todo) => {
        
        if (!todo) {
            return res.status(404).send({});
        };
        
        res.send({todo});
            
    }).catch( (e) => {
        res.status(400).send({});
    });

});

app.delete('/todos/:id', (req, res) => {
    
    var id = req.params.id;

    if (!ObjectId.isValid(id)) {
        return res.status(404).send({});
    };
        
    Todo.findByIdAndRemove(id).then( (todo) => {
        if (!todo) {
            return res.status(404).send({});
        }; 
        
        res.send({todo});
            
    }).catch( (e) => {
        res.status(400).send({});
    });

});

app.patch('/todos/:id', (req, res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']);

    if (!ObjectId.isValid(req.params.id)) {
        return res.status(404).send({});
    };

    if(_.isBoolean(req.body.completed) && req.body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    };

    Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then( (todo) => {
        if (!todo) {
            return res.status(404).send({});
        };
        res.send({todo})
    }).catch( (e) => {
        res.status(400).send({});
    });

});

app.listen(port, () => {
    console.log(`Started up at port: ${port}`);
});

module.exports = {app};