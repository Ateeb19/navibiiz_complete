const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const db = require('./Db_Connection.js')
const cors = require('cors');
require('dotenv').config({ path: './.env' });

// app.use(express.json());
app.use(express.json({ limit: '20mb' }));

app.use(cors({
    origin: [        
        '*',
        'http://localhost:3000',
        'http://217.154.86.64:3000',
        'https://novibiz.com',
        'https://www.novibiz.com',
        'http://betanovibiz.site',
        'https://p000tqb6-3000.inc1.devtunnels.ms',
    ],
    methods: ["POST", "GET", 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
        maxAge: 1000 * 60 * 60 * 1
    }
}));

// app.use(bodyParser.json());
app.use(bodyParser.json({ limit: '200mb' }));
// app.use(express.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true, limit: '200mb' }));



db.connect((err) => {
    if (err) {
        console.log('database not connected \n', err);
    } else {
        console.log('database connected');
    }
})

app.use('/hello', (req, res) => {
    res.json({ message: 'hello world' });
})


app.use('/user', require('./Routers/User_route.js'));
app.use('/company', require('./Routers/Company_route.js'));
app.use('/admin', require('./Routers/Admin_route.js'));
app.use('/s_admin', require('./Routers/S_Admin_route.js'));
app.use('/send_groupage', require('./Routers/Send_Groupage_router.js'));
app.use('/notification', require('./Routers/Notification_route.js'));
app.use('/paypal', require('./Routers/Paypal_route.js'));


app.listen((4000), () => {
    console.log('server is listing on -: http://localhost:4000')
})