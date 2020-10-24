const bcrypt = require('bcryptjs');
const { User } = require('../../../models');
const requireDir = require('require-dir');
const { Device, UserActivity } = require('../../../models');

module.exports = async (req, res) => {
    const id = req.accountId;
    const account = await User.findOne({ where: { id } });
    if (!req.body.password) {
        res.json('Password is required')
    } else if (!await bcrypt.compare(req.body.password, account.password)) {
        res.json('Invalid password')
    } else {
        await User.destroy({where: { id }});
        await Device.deleteMany({ userId: id });
        await UserActivity.deleteMany({ by: id });
        res.json('Deleted account')
    }
}