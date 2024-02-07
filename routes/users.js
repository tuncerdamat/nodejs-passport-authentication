const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const passport = require('passport')

// User model
const User = require('../models/User')

// login page
router.get('/login', (req, res) => res.render('login'))

// Register page
router.get('/register', (req, res) => res.render('register'))

// register handle
router.post('/register', (req, res) => {
    const {name, email, password, password2} = req.body
    let errors = []

    // CHeck required fields
    if (!name || !email || !password || !password2) {
        errors.push({msg: 'Fill in all the fields'})
    }

    // Check passwords match
    if (password !== password2) {
        errors.push({msg: 'Passwords do not match'})
    }

    if (password.length < 6) {
        errors.push({msg: 'Password should be at least six characters'})
    }


    if (errors.length > 0) {
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        })
    } else {
        // Validation passes
        User.findOne({email: email})
            .then(user => {
                if (user) {
                    // User exists
                    errors.push({msg: 'Email is already registered'})
                    res.render('register', {
                        errors,
                        name,
                        email,
                        password,
                        password2
                    })
                } else {
                    const newUser = new User({
                        name,
                        email,
                        password
                    })

                    // Hash Password
                    bcrypt.genSalt(10, (err, salt) =>
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) {
                                throw err
                            }

                            newUser.password = hash
                            newUser.save()
                                .then(user => {
                                    req.flash('success_msg', 'You are registered and can log in')
                                    res.redirect('/users/login')
                                })
                                .catch(err => console.log(err))
                        }))
                }
            })
    }
})

// Login handle
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next)
})

module.exports = router
