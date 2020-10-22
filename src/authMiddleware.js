const jwt = require('jsonwebtoken');
const Device = require('../../../models');
const { secret } = require('../../../src/secret.json');

module.exports = async (req, res, next) => {
    const { authorization } = req.headers;
    const UA = req.get('User-Agent');
    if (!authorization) {
        res.json('Authentication is required')
    } else {
        let parts = authorization.split(' ');
        if (parts.length !== 2) res.json('Access denied');
        var [ scheme, token ] = parts;

        if (!/^Bearer$/i.test(scheme)) res.json('Access denied');
        const device = await Device.findOne({ token });
        if(!device) {
            res.json('Access denied')
        } else if (device.UA ==! UA) {
            res.json('Unidentified device')
        } else {
            jwt.verify(token, secret, async (err, decoded) => {
                if (err) {
                    res.json('Access denied')
                } else {
                    device.lastActive = new Date();
                    await device.save();
                    req.accountId = decoded.id;
                    req.device = device.id;
                    return next()
                }
            })
        }
    }
}
