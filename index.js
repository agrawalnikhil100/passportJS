const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
//MongoDB session store for Express
const MongoStore = require('connect-mongo');

const app = express();


const dbString = "mongodb://localhost:27017/student";
const dbOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}
// connection to mongodb
const connection = mongoose.connect(dbString,dbOptions,(err)=>{
    if(err)console.log(err);
    else console.log("database is connected");
});

// connection to mongodb only for session data 
const sessionStore = MongoStore.create({
    mongoUrl: dbString,
    mongoOptions: dbOptions,
    collectionName: 'sessions'
});

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie:{
        maxAge: 1000*60*60*24 //1 day
    } 
}))


app.get('/', (req, res, next) =>{
    if(req.session.viewCount){
        req.session.viewCount++;
    }else{
        req.session.viewCount=1;
    }
    res.send(`<h1>Hello World ${req.session.viewCount}</h1>`)
})

const middleware1 = (req, res, next) => {
    console.log("I am middleware #1");
    req.demoNumber = 1;
    const errorObj = new Error('I am a test  error');
    next();
}

function errorHandler(err, req, res, next){
    if(err){
        res.send('<h1>Some error occurred <h1>')
    }
    next();
}

app.use(middleware1);
app.use(errorHandler);

app.listen(3000);
