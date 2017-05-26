//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectId} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    
    if (err) {
        return console.log('Unable to connect to MongoDB server');
    }

    console.log('Connected to MongoDB server');

    // db.collection('Todos').findOneAndUpdate({
    //     _id: new ObjectId("592837ef21b923912cb2fcd5")
    // }, {
    //     $set: {
    //         completed: true
    //     }
    // }, {
    //     returnOriginal: false
    // }, (err, result) => {
    //     if (err) {
    //         console.log(`ERROR: ${err}`);
    //     };
    //     console.log(`Updated Document: ${JSON.stringify(result.value, undefined, 2)}`);
    // });

    db.collection('Users').findOneAndUpdate({
        _id: new ObjectId("591d4cdc8cc6ee0b441e068a")
    }, {
        $inc: {
            age: -3
        }
    }, {
        returnOriginal: false
    }, (err, result) => {
        if (err) {
            console.log(`ERROR: ${err}`);
        };
        console.log(`Updated Document: ${JSON.stringify(result.value, undefined, 2)}`);
    });


    //db.close();

})