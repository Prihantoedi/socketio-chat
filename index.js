const express = require('express');
const dotenv = require('dotenv');
const { createServer } = require('node:http');
// const { join } = require('node:path');
const { createHash } = require('node:crypto');
const bodyParser = require('body-parser');
const mysql = require('mysql');

dotenv.config();

const app = express();


const server = createServer(app);

const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'node_chat'
});

con.connect(function(err){
    if(err) throw err;
    console.log('Connected to database!');
});

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// app.get('/', (req, res) => {
//     const data = {
//         status : 200,
//         msg : 'Successfully get'
//     };

//     res.status(200).send(data);
// });

app.get('/', (req, res) => {
    res.sendFile(__dirname + '\\pages\\home.html');
});

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '\\pages\\login.html');
});

app.get('/register', (req, res) => {
    res.sendFile(__dirname + '\\pages\\register.html');
});


app.post('/api/v1/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const sqlEmailChecking = 'SELECT * FROM users WHERE email = ?';

    con.query(sqlEmailChecking, [email], (error, results, fields) => {
        if(results.length === 1){   
            const hashPassword = createHash('sha256').update(password).digest('hex');

            if(hashPassword === results[0].password){
                const data = {
                    status: 200,
                    msg: 'success',
                    text: 'Login success',
                    user: { id: results[0].id} // encrypt this!!!
                };

                res.status(200).send(data);
            } else{
                const data = {
                    status: 400,
                    msg: 'failed',
                    text: 'Invalid Password!'
                };

                console.log('Invalid Password');

                res.status(400).send(data);
            }

        } else{
            const data = {
                status: 400,
                msg: 'failed',
                text: 'User not found'
            };

            console.log('User not found');

            res.status(400).send(data);
        }
    });
    
});


app.post('/api/v1/register', (req, res) => {
    const email = req.body.email;
    const sqlIfEmailExists = 'SELECT * FROM users WHERE email = ?';
    con.query(sqlIfEmailExists, [email], (error, results, fields) => {
        if(results.length === 0){
            const name = req.body.username;
            const password = req.body.password;
            const hashPassword = createHash('sha256').update(password).digest('hex');
            const sqlInsert = 'INSERT INTO users(name, email, password) VALUES (?, ?, ?)';
            con.query(sqlInsert, [name, email, hashPassword], (error, result) => {
                if(error) throw error;
            });
    
            const data = {
                status: 200,
                msg: 'success',
                text: 'Your account has been created successfully, please login with your registered account'
            };            
            res.status(200).send(data);
        } else{
            const data = {
                status: 400,
                msg: 'failed',
                text: 'Email is already exists'
            };
    
            res.status(400).send(data);
        }
    });

});




server.listen(3000, () => {
    console.log('server running at http://localhost:3000');

    // const content = 'prihanto edy sanjaya'; 

    // const hashing = createHash('sha256').update(content).digest('hex');
    // console.log(content);
    // console.log(hashing);

    // if(hashing === 'c99246c62752289735d75628a01736c2a8eaaff5fe6effb49605dd494f9155dc'){
    //     console.log('valid password');
    // } else{
    //     console.log('invalid password');
    // }

    // const sql = 'SELECT * FROM users';
    // con.query(sql, function(err, result, fields){
    //     if(err) throw err;
    //     console.log(result);
    //     for(let i = 0; i < result.length; ++i){
    //         console.log(result[i].id);
    //     }
    // });
});