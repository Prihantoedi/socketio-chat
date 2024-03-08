const express = require('express');
const dotenv = require('dotenv');
const { createServer } = require('node:http');
// const { join } = require('node:path');
const { createHash } = require('node:crypto');
const { bodyParser } = require('body-parser');
const mysql = require('mysql');

dotenv.config();

const app = express();
const server = createServer(app);

let urlencodedParser = bodyParser.urlencoded({extended: false});

const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'sso_main'
});

con.connect(function(err){
    if(err) throw err;
    // console.log('Connected!');
});

app.get('/', (req, res) => {
    const data = {
        status : 200,
        msg : 'Successfully get'
    };

    res.status(200).send(data);
});

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '\\pages\\login.html');
});

app.post('/register', urlencodedParser, (req, res) => {

    console.log(req.body.email);
    // res.sendFile(__dirname + '\\pages\\register.html');
});




server.listen(3000, () => {
    console.log('server running at http://localhost:3000');

    const content = 'prihanto edy sanjaya'; 

    const hashing = createHash('sha256').update(content).digest('hex');
    console.log(content);
    console.log(hashing);

    if(hashing === 'c99246c62752289735d75628a01736c2a8eaaff5fe6effb49605dd494f9155dc'){
        console.log('valid password');
    } else{
        console.log('invalid password');
    }

    const sql = 'SELECT * FROM users';
    con.query(sql, function(err, result, fields){
        if(err) throw err;
        console.log(result);
        for(let i = 0; i < result.length; ++i){
            console.log(result[i].id);
        }
    });
});