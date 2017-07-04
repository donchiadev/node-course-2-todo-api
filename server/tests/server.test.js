const expect = require('expect');
const request = require('supertest');
const {ObjectId} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

beforeEach(populateTodos);
beforeEach(populateUsers);

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
                    return done(err);
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

describe('GET /users/me', () => {
    it('should return user if authenticated', (done) => {
        request(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens[0].token)
            .expect( (res) => {
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email);
            })
            .end(done);
    });
    it('should return 401 if not authenticated', (done) => {
        request(app)
            .get('/users/me')
            .expect(401)
            .expect( (res) => {
                expect(res.body).toEqual({});
            })
            .end(done);
    });
});

describe('POST /users', () => {
    
    it('should create a user', (done) => {
        
        var email = 'dummy@email.com';
        var password = 'dummy_password';

        request(app)
            .post('/users')
            .send({email, password})
            .expect(200)
            .expect( (res) => {
                expect(res.headers['x-auth']).toExist();
                expect(res.body._id).toExist();
                expect(res.body.email).toBe(email);
            })
            .end( (err, res) => {
                if (err) {
                    return done(err);
                };
                User.findOne({email}).then( (user) => {
                    expect(user).toExist();
                    expect(user.password).toNotBe(password);
                    done();
                }).catch( (e) => done(e));
            });
    });

    it('should return validation error if request invalid', (done) => {
        
        var email = 'non_valid_email'
        var password = 123
        
        request(app)
            .post('/users')
            .send({email, password})
            .expect(400)
            .end(done)
    });

    it('should not create user if email in use', (done) => {

        var email = users[0].email;
        var password = 'valid_password'

        request(app)
            .post('/users')
            .send({email, password})
            .expect(400)
            .end(done)
    });
});

describe('POST /users/login', () => {

    it('should login user and return auth token', (done) => {
        
        request(app)
            .post('/users/login')
            .send({
                email: users[1].email,
                password: users[1].password
            })
            .expect(200)
            .expect( (res) => {
                expect(res.headers['x-auth']).toExist();
            })
            .end( (err, res) => {
                if (err) {
                    return done(err)
                };
                User.findById(users[1]._id).then( (user) => {
                    expect(user.tokens[0]).toInclude({
                        access: 'auth',
                        token: res.headers['x-auth']
                    });
                    done();
                }).catch( e => done(e));
            });
    });

    it('should reject invalid login', (done) => {

        request(app)
            .post('/users/login')
            .send({
                email: users[1].email,
                password: 123
            })
            .expect(400)
            .expect( (res) => {
                expect(res.headers['x-auth']).toNotExist();
                expect(res.body).toEqual({})
            })
            .end( (err, res) => {
                if (err) {
                    return done(err)
                };
                User.findById(users[1]._id).then( (user) => {
                    expect(user.tokens.length).toBe(0);
                    done();
                }).catch( e => done(e));
            });
    });

});