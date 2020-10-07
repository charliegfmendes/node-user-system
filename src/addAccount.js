const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../../../models');
const Device = require('../../../src/models/Device');
const UserActivity = require('../../../src/models/UserActivity');
const { secret } = require('../../../src/secret.json');
const { mobileNumberOrEmail } = require('./');

const existingMobileNumber = (data) => `An account is already associated with ${data.mobileNumber} mobile number`;
const existingEmail = (data) => `An account is already associated with ${data.email} email`;

async function create(data) {
    const firstActivity = new UserActivity({
        changeDescription: "Created account"
    });
    data.id = firstActivity.id;
    data.password = await bcrypt.hash(data.password, 10);
    try {
        const account = await User.create(data);
        account.password = 'secret';
        const token = jwt.sign({ id: account.id }, secret);
        const device = new Device({
            token,
            userId: account.id,
            UA: data.UA
        });
        firstActivity.save();
        device.save();
        return { account, token }
    } catch(error) {
        return mobileNumberOrEmail(data, existingMobileNumber, existingEmail);
    }
};

module.exports = async (req, res) => {
    req.body.UA = await req.get('User-Agent');
    const account = await mobileNumberOrEmail(req.body, create, create);
    res.json(account)
}
