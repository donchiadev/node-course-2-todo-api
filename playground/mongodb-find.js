//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectId} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    
    if (err) {
        return console.log('Unable to connect to MongoDB server');
    }

    console.log('Connected to MongoDB server');

    // db.collection('Todo').insertOne( {
    //     text: 'Something to do',
    //     completed: false
    // }, (err, res) => {
    //     if (err) {
    //         return console.log('Unable to insert todo', err)
    //     }

    //     console.log(JSON.stringify(res.ops, undefined, 2));
    // });

    // db.collection('Users').find({location: 'Palagiano'}).count( (err, count) => {
    //     if (err) {
    //         return console.log('ERROR: ', err)
    //     }
    //     console.log('Numero di Documenti: ', count);
    // })

    db.collection('Users').find({
        _id: new ObjectId("591b1ccd45c76e284c022cc5")
    }).toArray( (err, documents) => {
        if (err) {
            return console.log('ERROR: ', err)
        }
        console.log(JSON.stringify(documents, undefined, 2));
    })

    //db.close();

})



