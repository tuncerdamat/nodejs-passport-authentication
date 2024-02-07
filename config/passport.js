const LocalStrategy = require('passport-local').Strategy
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

// User Model
const User = require('../models/User')

module.exports = function (passport) {
    passport.use(
        new LocalStrategy({ usernameField: 'email'}, (email, password, done) => {
            // Match User
            User.findOne({email: email})
                .then(user => {
                    if(!user) {
                        return done(null, false, { message: 'That email is not registered!' })
                    }
                    
                    // Match the password
                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        if (err) {
                            throw err
                        }
                        
                        if(isMatch) {
                            return done(null, user)
                        }
                        
                        return done(null, false, { message: 'Password is incorrect' })
                    })
                })
                .catch(err => console.log(err))
        })
    )
    
    passport.serializeUser((user, done) => {
        done(null, user.id)
    })
    
    passport.deserializeUser( (id, done) => {
        User.findById(id).then(user => done(null, user));
    })
}
