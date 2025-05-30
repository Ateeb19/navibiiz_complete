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

const user_notification = (req, res) =>{
    db.query('SELECT company_name, logo FROM companies_info ORDER BY id DESC LIMIT 4', (err, result) => {
        if(err){
            res.json({message: 'error in database', status: false});
        }else{
            res.json({message: result, status: true});
        }
    })
}
module.exports = { admin_notificaiton, Sadmin_notificaiton, user_notification }