const express = require('express');

const app = express();


const middleware1 = (req, res, next) => {
    console.log("I am middleware #1");
    req.demoNumber = 1;
    const errorObj = new Error('I am a test error');
    next(errorObj);
}

function errorHandler(err, req, res, next){
    if(err){
        res.send('<h1>Some error occurred <h1>')
    }
    next();
}

app.use(middleware1);
app.use(errorHandler);

app.get('/', middleware1, (req, res, next) =>{
    res.send(`<h1>Hello World ${req.demoNumber}</h1>`)
})

app.listen(3000);
