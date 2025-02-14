const mongoose = require('mongoose');

const landSchema = new mongoose.Schema({
    ownerName: { type: String, required: true },
    ownerAddress: { type: String, required: true },
    ownerContact: { type: String, required: true },
    landAddress: { type: String, required: true },
    landSize: { type: Number, required: true },
    landPrice: { type: Number, required: true },
    landType: { type: String, required: true },
});

const Land = mongoose.model('Land', landSchema);

module.exports = Land;
