const Device = require('../../../models/Device');

module.exports = async (req, res) => {
    await Device.findByIdAndDelete(req.device);
    res.json('Device successfully logged out')
}
