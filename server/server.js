const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const path = require('path');

const app = express();

const port = process.env.PORT || 3000;

app.use(express.static('../public'));
app.use(bodyParser.json());
app.use(morgan('dev'));

app.listen(port, function(){
	console.log('L1st3n1ng 0n p0rt: ', port);
});
