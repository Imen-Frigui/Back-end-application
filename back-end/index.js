const express = require ('express')
const mongoose = require ('mongoose')
const bodyParser = require ('body-parser')
const cors = require ('cors')
const passport = require ('passport')
const path = require('path')
const session = require('express-session');

//bring dtabse obj
const config = require('./config/db')


//connect to databse
mongoose.connect(config.database, {useNewUrlParser: true}).then(() => {
    console.log('databse connected succsesfuly' + config.database)
}).catch(err => {
    console.log(err)
}
 )

//inti the application
const app = express()

//inti PORT
const PORT = process.env.PORT || 5000

//define MIDLWARES
app.use(cors())
//set the static folder
app.use(express.static(path.join(__dirname, 'client')))

app.use(session({secret: 'uwotm8',proxy: true,
resave: true,
saveUninitialized: true }));

//bodyPareser midlwaer
app.use(bodyParser.json())
//passport MIDLWAERS
app.use(passport.initialize())
app.use(passport.session())



app.get('/',(req, res) => {
    return res.json({
        message: 'auciton application'
    })
})

// Create a custom middleware function
const checkUserType = function (req, res, next) {
    const userType = req.originalUrl.split('/')[2];
    // Bring in the passport authentication starategy
    require('./config/passport')(userType, passport);
    next();
};

app.use(checkUserType);


//bringing user route
const users = require('./routes/users');
app.use('/api/users', users);

const admin = require('./routes/admin');
app.use('/api/admin', admin);



app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
