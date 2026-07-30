const Carrier = require('../models/Carrier');
const sendEmail = require('../config/email');

// 1. Carrier Signup Handler (Form submit hone par)
exports.registerCarrier = async (req, res) => {
  try {
    const { companyName, mcNumber, dotNumber, contactEmail, phone, servicesRequested } = req.body;

    // Form-data se aane wale JSON ko parse karna
    const parsedServices = typeof servicesRequested === 'string' ? JSON.parse(servicesRequested) : servicesRequested;

    const newCarrier = new Carrier({
      companyName,
      mcNumber,
      dotNumber,
      contactEmail,
      phone,
      servicesRequested: parsedServices,
      documents: {
        mcAuthorityDoc: req.files?.mcAuthorityDoc ? req.files.mcAuthorityDoc[0].path : '',
        coiDoc: req.files?.coiDoc ? req.files.coiDoc[0].path : '',
        w9Form: req.files?.w9Form ? req.files.w9Form[0].path : ''
      }
    });

    await newCarrier.save();

    // Automatic Email Confirmation to Carrier
    await sendEmail(
      contactEmail,
      `Onboarding Application Received - ${companyName}`,
      `Hello, Thank you for registering for our Dispatch/Lease/Factoring services. Your MC# ${mcNumber} is under review.`
    );

    res.status(201).json({ success: true, message: 'Signup Successful!', data: newCarrier });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// 2. Admin Approve / Reject Carrier (Status change hone par)
exports.updateCarrierStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const carrier = await Carrier.findByIdAndUpdate(id, { status }, { new: true });

    // Status update Email
    await sendEmail(
      carrier.contactEmail,
      `Carrier Onboarding Update: ${status}`,
      `Dear ${carrier.companyName}, your status for Dispatch & Factoring services is now: ${status}.`
    );

    res.json({ success: true, data: carrier });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

