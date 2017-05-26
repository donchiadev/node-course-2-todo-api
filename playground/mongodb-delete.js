//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectId} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    
    if (err) {
        return console.log('Unable to connect to MongoDB server');
    }

    console.log('Connected to MongoDB server');

    // // deleteMany
    // db.collection('Todos').deleteMany({text: "Do homework"}, undefined, (err, res) => {
    //     if (err) {
    //         return confirm.log('ERROR: ', err);
    //     }
    //     //console.log(res);
    //     console.log(`Document(s) deleted: ${res.result.n}`);
    // })

    // // deleteOne
    // db.collection('Todos').deleteOne({text: "Do homework"}, undefined, (err, res) => {
    //     if (err) {
    //         return confirm.log('ERROR: ', err);
    //     }
    //     //console.log(res);
    //     console.log(`Document(s) deleted: ${res.result.n}`);
    // })

    db.collection('Todos').findOneAndDelete({text: "Do homework"}, undefined, (err, res) => {
        if (err) {
            return confirm.log('ERROR: ', err);
        }
        //console.log(res);
        console.log(`Value Deleted: ${JSON.stringify(res.value, undefined, 2)}`);
    })

    //db.close();

})
