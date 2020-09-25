const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../../../models');
const Device = require('../../../src/models/Device');
const { secret } = require('../../../src/secret.json');
const { mobileNumberOrEmail } = require('./');

const existingMobileNumber = (data) => `An account is already associated with ${data.mobileNumber} mobile number`;
const existingEmail = (data) => `An account is already associated with ${data.email} email`;

async function create(data) {
    try {
        data.password = await bcrypt.hash(data.password, 10);
        const account = await User.create(data);
        account.password = 'secret';
        const token = jwt.sign({ id: account.id }, secret);
        const device = new Device({
            token,
            userId: account.id,
            UA: data.UA
         });
         device.save();
        return { account, token }
    } catch(error) {
        return mobileNumberOrEmail(data, existingMobileNumber, existingEmail)
    }
};

module.exports = async (req, res) => {
    req.body.UA = await req.get('User-Agent');
    const account = await mobileNumberOrEmail(req.body, create, create);
    res.json(account)
}
