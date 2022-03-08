const express = require ('express')
const router = express.Router()
const passport = require('passport')
const jwt = require('jsonwebtoken')
const User = require ('../models/User')
const config = require('../config/db')



router.post('/signup', (req, res) => {
    let newUser = User({
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    })
    User.addUser(newUser, (err, user) => {
        if (err){
            let message = ""
            if (err.errors.username) message ="username is alreasy takes "
            if (err.errors.email) message +="email is alreasy exists"
            return res.json({
                success: false,
                message
            })

        }else{
            return res.json({
                success: true,
                message : "User sucsufuly registerd"
            })
        }
        
    })
})

router.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    User.getUserByUsername(username, (err, user) => {
        if (err) throw err;
        if (!user) {
            return res.json({
                success: false,
                message: "User not found."
            });
        }

        User.checkPassword(password, user.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
                const token = jwt.sign({
                    type: "user",
                    data: {
                        _id: user._id,
                        username: user.username,
                        name: user.name,
                        email: user.email,
                    }
                }, config.secret, {
                    expiresIn: 600000 //
                });
                return res.json({
                    success: true,
                    token: "JWT " + token
                });
            } else {
                return res.json({
                    success: true,
                    message: "Wrong Password."
                });
            }
        });
    });
});

/**
 * authenticate user
 */
router.get('/profile',passport.authenticate('jwt',{session:false}),(req, res) => {
   console.log(req.user)
    return res.json(
        req.user
    )
})



module.exports = router