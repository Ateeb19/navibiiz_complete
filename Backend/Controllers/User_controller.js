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
    const { name, email, password, user_type } = req.body;
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
                            const token = jwt.sign({ userid: result.insertId, username: name, useremail: email, role: 'user', company: 'no', user_type: user_type }, process.env.JWT_SECRET, {
                                expiresIn: "1day",
                            });
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
        req.body.user_type
    ];
    // console.log(value[0],value[1],value[2]);
    // res.json(value[0], value[1], value[2]);
    db.query('SELECT * FROM users WHERE email = ?', [value[0]], async (error, result) => {
        if (error) {
            res.json({ message: "error in database" });
        } else {
            if (result.length > 0) {
                const hash = await bcrypt.compare(value[1], result[0].password);
                if (hash) {
                    const token = jwt.sign({ userid: result[0].id, username: result[0].name, useremail: result[0].email, role: result[0].role, company: result[0].company, user_type: result[0].user_type }, process.env.JWT_SECRET, {
                        expiresIn: "4day",
                    });
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
            res.json({ message: 'Name updated success', status: true });
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
                const hashpassword = await bcrypt.hash(editPasswordInputNew, 8);
                db.query('UPDATE users SET password = ? WHERE id = ?', [hashpassword, id], (err, result) => {
                    if (err) {
                        console.log(err);
                        res.json({ message: 'error in database', status: false });
                    } else {
                        res.json({ message: 'password updated', status: true });
                    }
                })
            } else {
                res.json({ message: "old password not match", status: false });
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
        'joelkuatefotso@webloon.de',
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


module.exports = { Register, login, update_user_name, update_user_password, display_profile, token_check, Send_message };