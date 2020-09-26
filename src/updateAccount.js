const bcrypt = require('bcryptjs');
const { User } = require('../../../models');

module.exports = async (req, res) => {
    const id = req.accountId;
    const account = await User.findOne({ where: { id }});
    if (!req.body.password) {
        await account.update(req.body);
        account.password = 'secret';
        res.json(account)
    } else if(!req.body.newPassword) {
        res.json('New password is required')
    } else {
        if(!await bcrypt.compare(req.body.password, account.password)) {
            res.json('Invalid password')
        } else {
            req.body.password = await bcrypt.hash(req.body.newPassword, 10);
            account.update(req.body)
            res.json('Password updated successfully')
        }
    }
}
