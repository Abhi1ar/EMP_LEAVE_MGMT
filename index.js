
let express = require('express');
let bodyParser = require('body-parser');
let mongoose = require('mongoose');
const authorize = require('./middleware/authorization');
let app = express();

// Import routes
let apiRoutes = require('./Router/api-route');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(authorize);
mongoose.connect('mongodb://127.0.0.1:27017/EmpLeaveDb', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true 
});
var db = mongoose.connection;

// Added check for DB connection
if (!db)
    console.log("Error connecting db")
else
    console.log("Db connected successfully")

// Setup server port
var port = process.env.PORT || 8080;


// Use Api routes in the App
app.use('/', apiRoutes);
// Launch app to listen to specified port
app.listen(port, function () {
    console.log("Running on port " + port);
});