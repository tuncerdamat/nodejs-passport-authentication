const express = require('express')
const path = require('path')
const expressLayouts = require('express-ejs-layouts')
const mongoose = require('mongoose')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport')

const app = express()

// Passport config
require('./config/passport')(passport)

// DB config
const dbConnectString = require('./config/keys').MongoURI

// DB connect
mongoose.connect(dbConnectString)
    .then(() => console.log('mongodb connected'))
    .catch(err => console.log(err))

// EJS
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs')
app.use(expressLayouts)

// Body parser
app.use(express.urlencoded({ extended: false }))

// Express session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))

app.use(passport.initialize())
app.use(passport.session())

// Connect flash
app.use(flash())

// Global variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')
    next()
})

const PORT = process.env.PORT || 5000

app.use('/', require('./routes/index'))
app.use('/users', require('./routes/users'))

app.listen(PORT, console.log(`Server started on port: ${PORT}`))
