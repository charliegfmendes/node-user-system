const Device = require("../../../models/Device");

module.exports = async (req, res) => {
    const devices = await Device.find({ userId: req.accountId });
    res.json(devices)
}
