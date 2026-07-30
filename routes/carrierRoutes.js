const express = require('express');
const router = express.Router(); 
const nodemailer = require('nodemailer');
const multer = require('multer');

const upload = multer({ storage: multer.memoryStorage() });

// Carrier Signup Route
router.post(
  '/signup',
  upload.fields([
    { name: 'mcAuthorityDoc', maxCount: 1 },
    { name: 'coiDoc', maxCount: 1 },
    { name: 'w9Form', maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { companyName, mcNumber, contactEmail, phone, servicesRequested } = req.body;
      const parsedServices = JSON.parse(servicesRequested || '[]');

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'dlbmanagement24@gmail.com',
          pass: 'nhvc rbyj yzbs sfjo',
        },
      });

      const attachments = [];
      if (req.files) {
        Object.keys(req.files).forEach((fieldName) => {
          const file = req.files[fieldName][0];
          attachments.push({
            filename: `${fieldName}_${file.originalname}`,
            content: file.buffer,
          });
        });
      }

      const mailOptions = {
        from: `"${companyName}" <dlbmanagement24@gmail.com>`,
        to: process.env.RECEIVER_EMAIL || 'dlbmanagement24@gmail.com',
        replyTo: contactEmail,
        subject: `🚚 New Carrier Signup: ${companyName} (${mcNumber})`,
        html: `
          <div style="font-family: Arial, sans-serif; background-color: #0f172a; color: #ffffff; padding: 20px; border-radius: 10px;">
            <h2 style="color: #f59e0b;">New Carrier Registration Application</h2>
            <hr style="border: 1px solid #334155;" />
            <p><strong>Company Name:</strong> ${companyName}</p>
            <p><strong>MC / DOT Number:</strong> ${mcNumber}</p>
            <p><strong>Contact Email:</strong> ${contactEmail}</p>
            <p><strong>Phone Number:</strong> ${phone}</p>
            <p><strong>Services Needed:</strong> ${parsedServices.join(', ') || 'None selected'}</p>
          </div>
        `,
        attachments: attachments,
      };

      await transporter.sendMail(mailOptions);
      res.status(200).json({ success: true, message: 'Application submitted successfully!' });
    } catch (error) {
      console.error('Email error:', error);
      res.status(500).json({ success: false, message: 'Error sending email.' });
    }
  }
);

// ✅ Naya Contact Form Route Add Kar Diya Gaya Hai
router.post('/contact', async (req, res) => {
  try {
    const { name, email, phone, company, service, message } = req.body;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'dlbmanagement24@gmail.com',
        pass: 'nhvc rbyj yzbs sfjo',
      },
    });

    const mailOptions = {
      from: `"${name}" <dlbmanagement24@gmail.com>`,
      to: 'dlbmanagement24@gmail.com',
      replyTo: email,
      subject: `📩 New Contact Message from ${name} (${company || 'Individual'})`,
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #0f172a; color: #ffffff; padding: 20px; border-radius: 10px;">
          <h2 style="color: #f59e0b;">New Consultation Request</h2>
          <hr style="border: 1px solid #334155;" />
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Company:</strong> ${company || 'N/A'}</p>
          <p><strong>Service Interested In:</strong> ${service || 'N/A'}</p>
          <p><strong>Message:</strong></p>
          <p style="background: #1e293b; padding: 10px; border-radius: 5px;">${message || 'N/A'}</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Contact email error:', error);
    res.status(500).json({ success: false, message: 'Error sending message.' });
  }
});

module.exports = router;