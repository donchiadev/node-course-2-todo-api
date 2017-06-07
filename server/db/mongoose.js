var mongoose = require('mongoose');

// const localdb = "mongodb://localhost:27017/TodoApp"
const mlab = "mongodb://antonio:dd3vconn3ct_@ds113702.mlab.com:13702/dbtodo"

mongoose.Promise = global.Promise;
mongoose.connect(mlab);

module.exports = {mongoose}