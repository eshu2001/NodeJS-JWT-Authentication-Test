const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const { expressjwt: ejwt } = require('express-jwt');
const bodyParser = require('body-parser');
const Path = require('path');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'Content-type,Authorization');
    next();
});

const Port = 3000;
const secretkey = 'my secret key';
const jwtMW = ejwt({
    secret: secretkey,
    algorithms: ['HS256'],
});

let users = [
    { id: 1, username: 'Eshita', password: '123' },
    { id: 2, username: 'Duvvada', password: '456' }
];


app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    for (let user of users) {
        if (user.username === username && user.password === password) {
            let token = jwt.sign({ id: user.id,username: user.username }, secretkey, { expiresIn: '7d' });
            res.json({
                success: true,
                err: null,
                token
            });
            break;
        }
        else {
            res.status(401).json({
                success: false,
                token: null,
                err: 'Username or password is incorrect',
            });
        }
    }


});

app.get('/api/dashboard',jwtMW, (req, res) => {
    console.log(req);
    res.json({
        success: true,
        mycontent: 'Secret content. Only logged in users can see that',
    });
});

app.get('/', (req, res) => {
    res.sendFile(Path.join(__dirname, 'index.html'));
});

app.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
        res.status(401).json({ success: false,
            officialError: err,
            err:'username or password is incorrect 2' });
    }
    else{
        next(err);
    }
});

app.listen(Port, () => {
    console.log(`Server is running on http://localhost:${Port}`);
});