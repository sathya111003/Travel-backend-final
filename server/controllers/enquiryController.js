const Enquiry = require('../models/Enquiry');
const nodemailer = require('nodemailer');

// @desc    Create new enquiry
// @route   POST /api/enquiries
// @access  Public
const createEnquiry = async (req, res) => {
    try {
        const { name, email, phone, subject, message, destination } = req.body;
        const enquiry = new Enquiry({ name, email, phone, subject, message, destination });
        const createdEnquiry = await enquiry.save();

        // Email Sending Logic
        let transporter;
        if (process.env.EMAIL_USER && process.env.EMAIL_PASS && process.env.EMAIL_PASS !== 'the_16_letter_password_here') {
            transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
            });
        } else {
            console.log('No valid EMAIL_PASS found. Using Ethereal test account for Enquiry...');
            let testAccount = await nodemailer.createTestAccount();
            transporter = nodemailer.createTransport({
                host: "smtp.ethereal.email",
                port: 587,
                secure: false,
                auth: { user: testAccount.user, pass: testAccount.pass },
            });
        }

        // Email to Admin
        const adminMailOptions = {
            from: `"Ravana Holidays System" <${process.env.EMAIL_USER || 'system@ravanaholidays.com'}>`,
            to: process.env.EMAIL_USER || 'ravanaholidaysofficial@gmail.com', // Send to admin
            subject: `New Enquiry from ${name}: ${subject || 'Website Contact Form'}`,
            html: `
                <h3>New Contact Enquiry Received</h3>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Phone:</strong> ${phone}</p>
                <p><strong>Subject:</strong> ${subject || 'N/A'}</p>
                <p><strong>Message:</strong><br/> ${message}</p>
                <p>Please log into your Admin Panel to manage this enquiry.</p>
            `
        };

        let adminInfo = await transporter.sendMail(adminMailOptions);

        if (!process.env.EMAIL_PASS || process.env.EMAIL_PASS === 'the_16_letter_password_here') {
            console.log("Admin Enquiry Email URL: %s", nodemailer.getTestMessageUrl(adminInfo));
        }

        res.status(201).json(createdEnquiry);
    } catch (error) {
        console.error('Enquiry Error:', error);
        res.status(400).json({ message: error.message || 'Failed to submit enquiry' });
    }
};

// @desc    Get all enquiries
// @route   GET /api/enquiries
// @access  Private/Admin
const getEnquiries = async (req, res) => {
    try {
        const enquiries = await Enquiry.find({}).sort({ createdAt: -1 });
        res.json(enquiries);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createEnquiry, getEnquiries };
