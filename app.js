const http = require('http');
const express = require('express');
const consolidate = require('consolidate');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const routes = require('./routes'); //File that contains our endpoints
const socketEvents = require('./socket-events');

const app = express();

app.use(bodyParser.urlencoded({
    extended: true,
}));

app.use(bodyParser.json({
    limit: '5mb'
}));

app.set('views', 'views'); // Set the folder-name from where you serve the html page.
app.use(express.static('./public')); // setting the folder name (public) where all the static files like css, js, images etc are made available

app.set('view engine', 'html');
app.engine('html', consolidate.handlebars); // Use handlebars to parse templates when we do res.render

// connect to Database
// const db = 'mongodb://localhost:27017/uberForX';
// console.log(process.env)
// mongoose.connect(process.env.MONGODB_URI, {
//     useUnifiedTopology: true,
//     useNewUrlParser: true,
// }).then(value => {
//     // Successful connection
//     console.log(value.models);
// }).catch(error => {
//     // Error in connection
//     console.log(error);
// });

try {
    mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/uberForX', {
        useUnifiedTopology: true,
        useNewUrlParser: true,
    }) 
} catch (e) {
    console.log(e)
}

mongoose.set('useCreateIndex', true);

app.use('/', routes);

const server = http.Server(app);
// const portNumber = 8000; // for locahost:8000

server.listen(process.env.PORT || 5000, () => { // Runs the server on port 8000
    socketEvents.initialize(server);
});