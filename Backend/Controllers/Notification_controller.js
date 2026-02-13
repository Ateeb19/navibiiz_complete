const db = require('../Db_Connection');


const admin_notificaiton = (req, res) => {
    if (req.user.role === 'admin') {
        db.query('SELECT id, product_name, img01, created_at FROM groupage ORDER BY id DESC LIMIT 4', (err, result) => {
            if (err) {
                console.log(err);
                res.json({ message: 'error in database', status: false });
            } else {
                res.json({ message: result, status: true });
            }
        })
    } else {
        res.json({ message: 'You are not an Admin' });
    }
}

const Sadmin_notificaiton = (req, res) => {
    if (req.user.role === 'Sadmin') {
        db.query('(SELECT groupage_created_by AS groupage_created_by, created_at AS groupage_created_at, img01, NULL AS company_info_name, NULL AS comapny_info_logo FROM groupage ORDER BY created_at DESC LIMIT 4) UNION ALL (SELECT NULL AS groupage_created_by, NULL AS groupage_created_at, NULL AS img01, company_name AS company_info_name, logo AS comapny_info_logo FROM companies_info ORDER BY id DESC LIMIT 4);', (err, result) => {
            if (err) {
                console.log(err);
                res.json({ message: 'error in database', status: false });
            } else {
                res.json({ message: result, status: true });
            }
        })
    } else {
        res.json({ message: 'You are not an Admin' });
    }
}

const user_notification = (req, res) => {
    const email = req.user.useremail;
    db.query(`
    SELECT 
        o.offer_id,   
        o.groupage_id,
        o.amount,
        o.commission,
        o.expeted_date,
        o.created_at,
        o.status,
        o.user_read,
        g.product_name,
        g.box_dimension
    FROM groupage g
    JOIN offers o ON o.groupage_id = g.id
    WHERE o.user_read = 0 AND o.status = 'pending' AND g.groupage_created_by = ?
`, [email], (err, result) => {
        if (err) {
            console.log(err);
            res.json({ message: 'error in database', status: false });
        } else {
            res.json({ message: result, status: true })
        }
    });
}

const user_read_notificaiton = (req, res) => {
    const email = req.user.useremail;
    db.query(`UPDATE offers o
                JOIN groupage g ON o.groupage_id = g.id
                SET o.user_read = 1
                WHERE o.status = 'pending'
                AND g.groupage_created_by = ?`, [email], (err, result) => {
        if (err) {
            res.json({ message: 'error in database', status: false });
        } else {
            res.json({ message: 'update', status: true });
        }
    })
}

const notification_bell = (req, res) => {
    const email = req.user.useremail;
    if (req.user.role === 'user') {
        db.query(`SELECT COUNT(*) AS unread_count
                    FROM groupage g
                    JOIN offers o ON o.groupage_id = g.id
                    WHERE o.status = 'pending'
                    AND o.user_read = 0
                    AND g.groupage_created_by = ?`, [email], (err, result) => {
            if (err) {
                res.json({ message: 'error in database', status: false });
            } else {
                res.json({ message: result[0].unread_count, status: true });
            }
        })
    }
}
module.exports = { admin_notificaiton, Sadmin_notificaiton, user_notification, notification_bell, user_read_notificaiton }