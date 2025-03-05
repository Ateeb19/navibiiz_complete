const db = require('../Db_Connection');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const Register = (req, res) => {
    const { name, email, password } = req.body;
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
                    db.query('INSERT INTO users SET ?', { name: name, email: email, password: hash, role: "user" }, (err, result) => {
                        if (err) {
                            res.json({ message: "error inserting data", err })
                        } else {
                            const token = jwt.sign({ userid: result.insertId, username: name, useremail: email, role: 'user' }, process.env.JWT_SECRET, {
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
        req.body.password
    ];
    // console.log(value[0],value[1]);
    db.query('SELECT * FROM users WHERE email = ?', [value[0]], async (error, result) => {
        if (error) {
            res.json({ message: "error in database" });
        } else {
            if (result.length > 0) {
                const hash = await bcrypt.compare(value[1], result[0].password);
                if (hash) {
                    const token = jwt.sign({ userid: result[0].id, username: result[0].name, useremail: result[0].email, role: result[0].role }, process.env.JWT_SECRET, {
                        expiresIn: "4day",
                    });
                    req.session.role = result[0].role;
                    req.session.email = result[0].email;
                    res.json({ message: "user login success", status: true, role: req.session.role, token, id: result[0].id, name: result[0].name, email: result[0].email });
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
    db.query('SELECT name, email, role FROM users WHERE id = ?', [id], (err, result) => {
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


module.exports = { Register, login, update_user_name, update_user_password, display_profile };