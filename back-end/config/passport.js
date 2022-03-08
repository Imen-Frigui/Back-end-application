const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/User');
const Admin = require('../models/Admin');
//tocheck origins of requests
const config = require('../config/db')


//auth User by JWT
module.exports = (userType,passport) => {
    let opts = {}
    //extracting the headted of jwt token
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt')
    //match secrets(not cheking)
    opts.secretOrKey = config.secret
    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
        if (userType == 'admin') {
            Admin.getAdminById(jwt_payload.data._id, (err, user) => {
                if (err) return done(err, false);
                if (user) return done(null, user);
                return done(null, false);
            });
        }
        if (userType == 'users') {
            User.getUserById(jwt_payload.data._id, (err, user) => {
                if (err) return done(err, false);
                if (user) return done(null, user);
                return done(null, false);
            });
        }
    }));
}