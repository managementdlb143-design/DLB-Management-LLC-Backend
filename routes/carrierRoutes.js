const express = require('express');
const router = express.Router(); // ✅ Router properly define kiya
const nodemailer = require('nodemailer');
const multer = require('multer');

// Files ko memory me handle karne ke liye Multer setup
const upload = multer({ storage: multer.memoryStorage() });

// Form Submission & Email Sending Route
router.post(
  '/signup', // ✅ Yahan /signup rakha hai taaki /api/carrier/signup ban jaye
  upload.fields([
    { name: 'mcAuthorityDoc', maxCount: 1 },
    { name: 'coiDoc', maxCount: 1 },
    { name: 'w9Form', maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { companyName, mcNumber, contactEmail, phone, servicesRequested } = req.body;
      const parsedServices = JSON.parse(servicesRequested || '[]');

      // 1. Nodemailer Transporter (Gmail / SMTP Config)
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'dlbmanagement24@gmail.com',
          pass: 'nhvc rbyj yzbs sfjo',
        },
      });

      // 2. Attachments Prepare Karein
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

      // 3. Email Layout & Details
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
            
            <hr style="border: 1px solid #334155;" />
            <p style="color: #94a3b8; font-size: 12px;">Attached documents: MC Authority, COI, and W9 Form (if provided).</p>
          </div>
        `,
        attachments: attachments,
      };

      // 4. Send Email
      await transporter.sendMail(mailOptions);
      res.status(200).json({ success: true, message: 'Application submitted successfully!' });
    } catch (error) {
      console.error('Email error:', error);
      res.status(500).json({ success: false, message: 'Error sending email.' });
    }
  }
);

// ✅ Ab yeh router sahi export hoga
module.exports = router;