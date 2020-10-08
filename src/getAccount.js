const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../../../models');
const Device = require('../../../src/models/Device');
const UserActivity = require('../../../src/models/UserActivity');
const { secret } = require('../../../src/secret.json');
const { mobileNumberOrEmail } = require('./');

const identifierByMobileNumber = async (data) => {
    const { mobileNumber } = data;
    const account = await User.findOne({ where: { mobileNumber }})
    if (!account) {
        return `There's no account associated with ${mobileNumber} mobile number`
    } else {
        return read(account, data)
    }
};

const identifierByEmail = async (data) => { 
    const { email } = data;
    const account = await User.findOne({ where: { email }});
    if (!account) {
        return `There's no account associated with ${email} email`
    } else {
        return read(account, data)
    }
};

async function read(account, data) {
    if (!await bcrypt.compare(data.password, account.password)) {
        return 'Invalid password'
    } else {
        const token = jwt.sign({ id: account.id }, secret);
        const device = new Device({ 
            token,
            userId: account.id,
            UA: data.UA
        });
        const access = new UserActivity({
            activity: `Access on ${data.UA}`
        });
        device.save();
        access.save();
        account.password = 'secret';
        return { account, token }
    }
};

module.exports = async (req, res) => {
    req.body.UA = req.get('User-Agent');
    const account = await mobileNumberOrEmail(req.body, identifierByMobileNumber, identifierByEmail);
    res.json(account)
}
