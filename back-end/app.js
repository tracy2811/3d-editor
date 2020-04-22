require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const indexRouter = require('./routers/index');
const userRouter = require('./routers/user');
const modelRouter = require('./routers/model');
const app = express();
console.log(process.env.MONGODB);

mongoose.connect(process.env.MONGODB, { useNewUrlParser: true, useUnifiedTopology: true, });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true, }));
app.use(morgan('dev'));

app.use('/', indexRouter);
app.use('/users', userRouter);
app.use('/models', modelRouter);

app.use(function (req, res, next) {
	res.sendStatus(404);
});

app.listen(process.env.PORT, () => console.log(`Server listening on port ${process.env.PORT}`));

