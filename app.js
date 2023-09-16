const express = require('express');
const session = require('express-session');
const { router } = require('./system/Route');
const { Profiler } = require('./system/Profiler');
const { port, session_info } = require('./application/config');
const app = express();
const bodyParser = require('body-parser');

app.use(session(session_info));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + "/application/assets"));

app.set('views', (__dirname + "/application/views"));
app.set('view engine', 'ejs');

app.use((req,res,next) => {
    Profiler.enable_profiler(req,res,next);
});
app.use('/', router);

app.listen(port, () => {
    console.log('Listening on port', port);
});