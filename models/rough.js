
const mongoose = require("mongoose");

const customerSchema = mongoose.Schema({
    customername: String,
    location: String,
    address: String
  });

module.exports = mongoose.model('Customer', customerSchema);





const vendorSchema = mongoose.Schema({
    vendorname: String,
    location: String,
    address: String
  });

module.exports = mongoose.model('Vendor', vendorSchema);














const authorModel = mongoose.Schema({
    clientName: {
        type: String,
        required: '{PATH} is required!'
    },
    website: {
        type: String
    },
    customer:
        { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
    vendor: 
        { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' }
}, {
    timestamps: true
});

module.exports = mongoose.model('Author', authorModel);












