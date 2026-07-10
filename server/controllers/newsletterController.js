const nodemailer = require('nodemailer');
const Newsletter = require('../models/Newsletter');

// @desc    Subscribe to newsletter and send email
// @route   POST /api/newsletter
// @access  Public
const subscribeNewsletter = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    try {
        // Save to Database first
        const existingSubscriber = await Newsletter.findOne({ email });
        if (!existingSubscriber) {
            await Newsletter.create({ email });
        }

        let transporter;

        // Check if real credentials exist and are not the placeholder
        if (process.env.EMAIL_USER && process.env.EMAIL_PASS && process.env.EMAIL_PASS !== 'the_16_letter_password_here') {
            transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            });
        } else {
            // Fallback: Generate test Ethereal account if no real credentials provided
            console.log('No valid EMAIL_PASS found in .env. Generating test email account...');
            let testAccount = await nodemailer.createTestAccount();
            transporter = nodemailer.createTransport({
                host: "smtp.ethereal.email",
                port: 587,
                secure: false,
                auth: {
                    user: testAccount.user,
                    pass: testAccount.pass,
                },
            });
        }

        const instaUrl = "https://www.instagram.com/_ravana_holidays_official_?igsh=ZjU3Z3JuZjF6ZDJ3&utm_source=qr";

        // HTML Email content
        const mailOptions = {
            from: `"Ravana Holidays" <${process.env.EMAIL_USER || 'no-reply@ravanaholidays.com'}>`,
            to: email,
            subject: 'Welcome to Ravana Holidays Newsletter! ✈️🌍',
            html: `
                <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto; color: #333;">
                    <h2 style="color: #EF4444; text-align: center;">Welcome to Ravana Holidays!</h2>
                    <p style="font-size: 16px;">Hello there,</p>
                    <p style="font-size: 16px;">Thank you for subscribing to our newsletter! You will now receive the latest travel deals, premium packages, and exclusive destination news directly to your inbox.</p>
                    
                    <div style="background-color: #f9f9f9; padding: 20px; border-radius: 10px; margin: 20px 0; text-align: center; border: 1px solid #ddd;">
                        <h3 style="margin-top: 0;">Stay Connected</h3>
                        <p style="font-size: 15px; color: #555;">Follow us on Instagram for daily travel inspiration, beautiful memories, and exciting updates!</p>
                        <a href="${instaUrl}" style="display: inline-block; background-color: #EF4444; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; margin-top: 10px;">Follow Us on Instagram</a>
                    </div>
                    
                    <p style="font-size: 16px;">We can't wait to plan your next dream vacation.</p>
                    <p style="font-size: 16px; margin-bottom: 0;">Warm Regards,</p>
                    <p style="font-size: 16px; font-weight: bold; margin-top: 5px;">The Ravana Holidays Team</p>
                </div>
            `
        };

        // Send email
        let info = await transporter.sendMail(mailOptions);

        if (!process.env.EMAIL_PASS || process.env.EMAIL_PASS === 'the_16_letter_password_here') {
            console.log("Test Email sent! Preview URL: %s", nodemailer.getTestMessageUrl(info));
        }

        res.status(200).json({ message: 'Successfully subscribed! Check your email.' });
    } catch (error) {
        console.error('Newsletter Error: ', error);
        res.status(500).json({ message: 'Failed to subscribe. Please try again later.' });
    }
};

module.exports = { subscribeNewsletter };
