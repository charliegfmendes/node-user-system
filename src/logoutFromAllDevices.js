const Device = require('../../../models/Device');

module.exports = async (req, res) => {
    const currentDevice = await Device.findById(req.device)
    await Device.deleteMany({ userId: req.accountId });
    await Device.create({
        _id: currentDevice._id,
        token: currentDevice.token,
        userId: currentDevice.userId,
        UA: currentDevice.UA
    });
    const devices = await Device.find({ userId: req.accountId });
    res.json(devices)
}
