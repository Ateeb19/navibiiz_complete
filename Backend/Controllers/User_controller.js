const db = require('../Db_Connection');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const sendMail = require('../Email/Send_mail');


const token_check = (req, res) => {
    if (req.user.role === 'user') {
        res.json({ message: 'user', status: true });
    } else if (req.user.role === 'admin') {
        res.json({ message: 'admin', status: true });
    } else if (req.user.role === 'Sadmin') {
        res.json({ message: 'Sadmin', status: true });
    } else {
        res.json({ message: 'Login again to continue', status: false })
    }
}
const Register = (req, res) => {
    const { name, email, password, user_type, rememberMe } = req.body;
    db.query("SELECT email FROM users WHERE email = ?", [email], async (err, result) => {
        if (err) {
            res.json({ message: "error in databasae", err });
        } else {
            if (result.length > 0) {
                res.json({ message: "email is in use", status: false });
            } else {
                if (password.length < 8) {
                    res.json({ message: "password must be of 8 characters", status: false });
                } else {
                    const hash = await bcrypt.hash(password, 8);
                    db.query('INSERT INTO users SET ?', { name: name, email: email, password: hash, role: "user", company: 'no', user_type: user_type }, (err, result) => {
                        if (err) {
                            res.json({ message: "error inserting data", err })
                        } else {
                            let token = '';
                            if (rememberMe === false) {
                                token = jwt.sign({ userid: result.insertId, username: name, useremail: email, role: 'user', company: 'no', user_type: user_type }, process.env.JWT_SECRET, {
                                    expiresIn: "1day",
                                });
                            } else {
                                token = jwt.sign({ userid: result.insertId, username: name, useremail: email, role: 'user', company: 'no', user_type: user_type }, process.env.JWT_SECRET, {
                                    expiresIn: "5day",
                                });
                            }
                            res.json({ message: "user regester success", status: true, role: 'user', token: token, name: name, email: email, id: result.insertId });
                        }
                    })
                }
            }
        }
    });
}
const login = (req, res) => {
    const value = [
        req.body.email,
        req.body.password,
        req.body.user_type,
        req.body.rememberMe,
    ];
    // console.log(value[3], '-: rememberme!');
    // res.json(value[0], value[1], value[2]);
    db.query('SELECT * FROM users WHERE email = ?', [value[0]], async (error, result) => {
        if (error) {
            res.json({ message: "error in database" });
        } else {
            if (result.length > 0) {
                const hash = await bcrypt.compare(value[1], result[0].password);
                if (hash) {
                    let token = '';
                    if (value[3] === false) {
                        token = jwt.sign({ userid: result[0].id, username: result[0].name, useremail: result[0].email, role: result[0].role, company: result[0].company, user_type: result[0].user_type }, process.env.JWT_SECRET, {
                            expiresIn: "2h",
                        });
                    } else {
                        token = jwt.sign({ userid: result[0].id, username: result[0].name, useremail: result[0].email, role: result[0].role, company: result[0].company, user_type: result[0].user_type }, process.env.JWT_SECRET, {
                            expiresIn: "5day",
                        });
                    }
                    req.session.role = result[0].role;
                    req.session.email = result[0].email;
                    if (result[0].user_type === value[2]) {
                        res.json({ message: "user login success", status: true, role: req.session.role, token, id: result[0].id, name: result[0].name, email: result[0].email, company: result[0].company, user_type: result[0].user_type });
                    } else {
                        res.json({ message: `You can not login with ${value[2]} type. \nSelect the correct user type`, status: false })
                    }
                }
                else {
                    res.json({ message: "email or password is wrong", status: false });
                }
            } else
                if (result.length === 0) {
                    res.json({ message: "email or password is wrong", status: false })
                }
        }
    })
}

//display profile
const display_profile = (req, res) => {
    const id = req.user.userid;
    db.query('SELECT name, email, role, company, user_type FROM users WHERE id = ?', [id], (err, result) => {
        if (err) {
            console.log(err);
            res.json({ message: "error in database", status: false });
        } else {
            res.json({ message: result[0], status: true });
        }
    })
}

//update user
const update_user_name = (req, res) => {
    const id = req.user.userid;
    const editNameInput = req.body.editNameInput;
    db.query('UPDATE users SET name = ? WHERE id = ?', [editNameInput, id], (err, result) => {
        if (err) {
            console.log(err);
            res.json({ message: 'error in database', status: false });
        } else {
            res.json({ message: 'Name updated success, Login agmin to see update Name!', status: true });
        }
    })
}
const update_user_password = (req, res) => {
    const id = req.user.userid;
    const editPasswordInputOld = req.body.editPasswordInputOld;
    const editPasswordInputNew = req.body.editPasswordInputNew;

    db.query(`SELECT password FROM users WHERE id = ${id}`, async (err, result) => {
        if (err) {
            console.log(err);
            res.json({ message: 'error in database', status: false });
        } else {
            const hash = await bcrypt.compare(editPasswordInputOld, result[0].password);
            if (hash) {
                if (editPasswordInputNew.length < 8) {
                    res.json({ message: "Password should be of 8 characters", status: false });
                } else {
                    const hashpassword = await bcrypt.hash(editPasswordInputNew, 8);
                    db.query('UPDATE users SET password = ? WHERE id = ?', [hashpassword, id], (err, result) => {
                        if (err) {
                            console.log(err);
                            res.json({ message: 'error in database', status: false });
                        } else {
                            res.json({ message: 'password updated', status: true });
                        }
                    })
                }
            } else {
                res.json({ message: "Previous password not match", status: false });
            }
        }
    })
}

const Send_message = (req, res) => {
    const value = [
        req.body.user_name,
        req.body.email_id,
        req.body.contact_number,
        req.body.country,
        req.body.message,
    ];

    sendMail(
        'info@novibiz.com',
        "Find Details as below",
        `<div style="background-color: #ffffff; color: #000000;">
            <span>Hi <br> Find Details as below</span><br><br>
            <span><b>Name: </b> ${value[0]}</span><br/>
            <span><b>Email: </b> ${value[1]}</span><br/>
            <span><b>Contact Number: </b> ${value[2]}</span><br/>
            <span><b>Country: </b> ${value[3]}</span><br/>
            <span><b>Message: </b> <p style="padding-left: 30px;">${value[4]}</p></span>
        </div>`
    )
        .then(info => console.log({ info }))
        .catch(console.error);
    res.json(value);
}

const payment_history = (req, res) => {
    const id = req.user.userid;
    db.query('SELECT * FROM payment_info_customers WHERE user_id = ?', [id], (err, result) => {
        if (err) {
            console.log(err);
            res.json({ message: 'error in database', status: false });
        } else {
            res.json({ message: result, status: true });
        }
    })
}

//forget password
const froget_password = (req, res) => {

    const email = req.body.email;
    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
        expiresIn: '2h'
    });
    db.query('INSERT INTO rest_token (email, token) VALUES (?, ?)', [email, token], async (err, result) => {
        if (err) {
            res.json({ message: "error in database", err });
        } else {
            sendMail(
                email,
                "Reset Password",
                `<html>
                <body>
                <h3>Click on the following link to reset password</h3>
                <h4><a href="https://novibiz.com/reset_password/${token}">Reset Password</a></h4>
                <h4>Your token: ${token}</h4>
                <h4>Token is valid for only 2 hours</h4>
                </body>
                </html>`
            )
                .then(info => console.log({ info }))
                .catch(console.error);
            res.json({ message: "email send success" });
        }
    })
}

//reset password
const reset_password = (req, res) => {
    const token = req.params.token;
    const value = [
        req.body.password,
        req.body.confirmpassword,
    ]

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) {
            res.json({ message: "invalid or expire token" });
        } else {
            const email = decoded.email;
            if (value[0].length < 8) {
                res.json({ message: "password shoud be of 8 charachers" });
            } else
                if (value[0] !== value[1]) {
                    res.json({ message: "confirmpassword not match" });
                } else {
                    const hash = await bcrypt.hash(value[0], 8);
                    db.query('UPDATE users SET password = ? WHERE email = ?', [hash, email], (err, result) => {
                        if (err) {
                            res.json({ message: "error in database" });
                        } else {
                            res.json({ message: "password reset success \n Login again!", status: true });
                            db.query('DELETE FROM `rest_token` WHERE email = ?', [email]);
                        }
                    })
                }
        }
    })
}

const total_number_orders = (req, res) => {
    const email = req.user.useremail;
    db.query('SELECT COUNT(*) AS total_orders FROM groupage WHERE groupage_created_by = ?', [email], (err, result) => {
        if (err) {
            console.log(err);
            res.json({ message: 'error in database', status: false });
        } else {
            res.json({ message: result[0].total_orders, status: true });
        }
    })
}

const user_upcoming = (req, res) => {
    const email = req.user.useremail;
    db.query(`
        SELECT COUNT(*) AS total
        FROM offers o
        JOIN groupage g ON o.groupage_id = g.id
        WHERE g.payment_status = 'complete'
          AND g.groupage_created_by = ?
          AND o.status = 'complete'
          AND STR_TO_DATE(SUBSTRING_INDEX(g.pickup_date, ' - ', -1), '%d/%m/%Y') <= CURDATE()
    `, [email], (err, result) => {
        if (err) {
            console.log(err);
            res.json({ message: 'error in database', status: false });
        } else {
            res.json({ message: result[0].total, status: true });
        }
    });
    
}

const comapny_details = (req, res) => {
    const id = req.params.id;
    db.query('SELECT created_by_email FROM offers WHERE offer_id = ?', [id], (err, result) => {
        if(err){
            res.json({message: "error in database", status: false});
        }else{
            console.log(result[0].created_by_email);
            db.query('SELECT company_name, email, contact_person_name, contect_no FROM companies_info WHERE email = ?', [result[0].created_by_email], (err, result) => {
                if(err){
                    res.json({message: "error in database", status: false});
                }else{
                    res.json({message: result[0], status: true});
                }
            })
        }
    });
}

const user_delete = (req, res) => {
    const email = req.body.email;
    db.query('DELETE FROM users WHERE email = ?', [email], (err, result) => {
        if (err) {
            console.log(err);
            res.json({ message: 'error in database', status: false });
        } else {
            res.json({ message: 'user deleted success', status: true });
        }
    })
}
module.exports = { Register, login, update_user_name, update_user_password, display_profile, token_check, Send_message, payment_history, froget_password, reset_password, total_number_orders, user_upcoming , comapny_details, user_delete};