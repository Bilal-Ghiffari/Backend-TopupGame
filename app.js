var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const cors =  require('cors');

const dasboardRouter = require('./App/dashboard/router');
const categoryRouter = require('./App/category/router');
const nominalRouter = require('./App/nominal/router');
const voucherRouter = require('./App/voucher/router');
const bankRouter = require('./App/bank/router');
const paymentRouter = require('./App/payment/router');
const usersRouter = require('./App/users/router');
const transactionRouter = require('./App/transaction/router')
const playerRouter = require('./App/player/router');
const authRouter = require('./App/auth/router');

var app = express();
app.use(cors())
const URL = `/api/v1`

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: {}
}))
app.use(flash());
app.use(methodOverride('_method'));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/adminlte', express.static(path.join(__dirname, '/node_modules/admin-lte')));

app.use('/', usersRouter);
app.use('/dashboard', dasboardRouter);
app.use('/category', categoryRouter);
app.use('/nominal', nominalRouter);
app.use('/voucher', voucherRouter);
app.use('/bank', bankRouter);
app.use('/payment', paymentRouter);
app.use('/transaction', transactionRouter);

// API
app.use(`${URL}/players`, playerRouter)
app.use(`${URL}/auth`, authRouter)


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

// Link Postman 
// https://documenter.getpostman.com/view/15820975/UVR8q8Wu
//MONGO_URL = mongodb+srv://codeathome:Ghiffari_Al10@cluster0.3cqax.mongodb.net/db_topup-game?retryWrites=true&w=majority
// MONGO_URL_DEV = mongodb://127.0.0.1:27017/db_topup-game