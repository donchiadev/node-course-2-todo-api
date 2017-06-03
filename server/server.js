var express = require('express');
var bodyParser = require('body-parser');

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

app.listen(port, () => {
    console.log(`Started on Port: ${port}`)
});

module.exports = {app};