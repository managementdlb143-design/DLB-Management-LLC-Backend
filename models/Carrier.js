const mongoose = require('mongoose');



const carrierSchema = new mongoose.Schema({

  companyName: { type: String, required: true },

  mcNumber: { type: String, required: true, unique: true }, // MC/DOT Number

  dotNumber: { type: String },

  contactEmail: { type: String, required: true },

  phone: { type: String, required: true },

  

  // Services Selected (Checkboxes from Frontend)

  servicesRequested: {

    dispatch: { type: Boolean, default: false },

    mcLease: { type: Boolean, default: false },

    factoring: { type: Boolean, default: false }

  },



  // Documents List (Uploaded via Multer)

  documents: {

    mcAuthorityDoc: { type: String },

    coiDoc: { type: String }, // Certificate of Insurance

    w9Form: { type: String }

  },



  status: { type: String, enum: ['Pending Review', 'Approved', 'Rejected'], default: 'Pending Review' },

  createdAt: { type: Date, default: Date.now }

});



module.exports = mongoose.model('Carrier', carrierSchema);