const expect = require('expect');
const request = require('supertest');
const {ObjectId} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const todos = [{
    _id: new ObjectId(),
    text: 'First test todo'
},{
    _id: new ObjectId(),
    text: 'Second test todo',
    completed: false,
    completedAt: 333
}];

beforeEach( (done) => {
    Todo.remove({}).then( () => {
        return Todo.insertMany(todos);
    }).then( () => done());
});

describe('POST /todos', () => {
    it('should create new todo', (done) => {
        var text = 'Test todo text';

        request(app)
            .post('/todos')
            .send({text})
            .expect(200)
            .expect( (res) => {
                expect(res.body.text).toBe(text);
            })
            .end( (err, res) => {
                if (err) {
                    return done(err)
                };

                Todo.find({text}).then( (todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch( (e) => done(e));
            });

    });

    it("should not create todo with invalid body data", (done) => {
        
        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end( (err, res) => {
                if (err) {
                    return done(err)
                };

                Todo.find().then( (todos) => {
                    expect(todos.length).toBe(2);
                    done()
                }).catch( (e) => done(e));
            });
    });
});

describe('GET /todos', () => {
    it('should get all todos', (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect( (res) => {
                expect(res.body.todos.length).toBe(2);
            })
            .end(done);
           
    });
});

describe('GET /todos/:id', () => {
    
    it('should get one todo via id', (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect( (res) => {
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end(done);
    });

    it('should return 404 for non-object ids', (done) => {
        request(app)
        .get(`/todos/123abc`)
        .expect(404)
        .end(done);
    });

     it('should return 404 if todo not found', (done) => {
        request(app)
        .get(`/todos/${(new ObjectId()).toHexString()}`)
        .expect(404)
        .end(done);
    });

});

describe('DEL /todos/:id', () => {

    it('should delete one todo via id', (done) => {
        request(app)
            .delete(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect( (res) => {
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end( (err, res) => {
                if (err) {
                    done(err);
                };
                Todo.findById(todos[0]._id.toHexString()).then( (todo) => {
                    expect(todo).toNotExist();
                    done();
                }).catch( (e) => done(e));
            });
    });

    it('should return 404 for non-object ids', (done) => {
        request(app)
        .delete(`/todos/123abc`)
        .expect(404)
        .end(done);
    });

     it('should return 404 if todo not found', (done) => {
        request(app)
        .delete(`/todos/${(new ObjectId()).toHexString()}`)
        .expect(404)
        .end(done);
    });

});

describe('PATCH /todos/:id', () => {

    var body = {text: "Updated Text", completed: true};

    it('should update the todo', (done) => {
        var id = todos[0]._id.toHexString();
        request(app)
            .patch(`/todos/${id}`)
            .send(body)
            .expect(200)
            .expect( (res) => {
                expect(res.body.todo).toInclude(body);
                expect(res.body.todo.completedAt).toBeA('number');
            })
            .end(done);     
    });

    it('should clear completedAt when todo is not completed', (done) => {
        var id = todos[1]._id.toHexString();
        var body = {text: "Updated Text", completed: false};
        request(app)
        .patch(`/todos/${id}`)
        .send(body)
        .expect(200)
        .expect( (res) => {
            expect(res.body.todo).toInclude(body);
            expect(res.body.todo.completedAt).toNotExist();
        })
       .end(done); 
    });

});