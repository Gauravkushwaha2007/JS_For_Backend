const crypto = require('crypto');
const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const sendmail = require('../utils/mailer');
const ejs = require('ejs');
const path = require('path');

const getBaseUrl = (req) => {
    return process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
};

const establishUserSession = (req, userId) => {
    return new Promise((resolve, reject) => {
        req.session.regenerate((regenerateError) => {
            if (regenerateError) return reject(regenerateError);

            req.session.userId = userId;
            req.session.save((saveError) => {
                if (saveError) return reject(saveError);
                resolve();
            });
        });
    });
};

// 1. REGISTER USER WITH OTP
const registerUser = async (req, res) => {
    try {
        let { name, email, password, contact } = req.body;
    
        let registeredUser = await userModel.findOne({ email });
        if (registeredUser) {
            if (registeredUser.isVerified) {
                return res.render('auth/register', { error: 'This email is already registered!' });
            }
            
            // User is registered but not verified yet. Allow them to resend details and get a fresh OTP.
            let salt = await bcrypt.genSalt(10);
            let hash = await bcrypt.hash(password, salt);
            const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
            const otpExpires = Date.now() + 600000; // OTP 10 mins

            registeredUser.name = name;
            registeredUser.password = hash;
            registeredUser.contact = contact;
            registeredUser.otp = generatedOtp;
            registeredUser.otpExpires = otpExpires;
            registeredUser.otpAttempts = 0;
            await registeredUser.save();

            try {
                const templatePath = path.join(__dirname, '../views/emails/welcome.ejs');
                const welcomeHtml = await ejs.renderFile(templatePath, { 
                    userName: registeredUser.name, 
                    hostUrl: getBaseUrl(req),
                    otp: generatedOtp 
                });

                await sendmail(
                    email,
                    `KUSH MART - Verify Your Account (OTP: ${generatedOtp}) 🛒`,
                    welcomeHtml
                );
            } catch (mailError) {
                console.error("Mail Sending Failed:", mailError.message);
            }
            return res.redirect(`/users/verify-otp?email=${email}`);
        }
        
        let salt = await bcrypt.genSalt(10);
        let hash = await bcrypt.hash(password, salt);
        
        const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = Date.now() + 600000; // OTP 10 mins

        let user = await userModel.create({
            name,
            email, 
            password: hash,
            contact,
            otp: generatedOtp,
            otpExpires
        });
        
        try {
            const templatePath = path.join(__dirname, '../views/emails/welcome.ejs');
            const welcomeHtml = await ejs.renderFile(templatePath, { 
                userName: user.name, 
                hostUrl: getBaseUrl(req),
                otp: generatedOtp 
            });

            await sendmail(
                user.email,
                `KUSH MART - Verify Your Account (OTP: ${generatedOtp}) 🛒`,
                welcomeHtml
            );
        } catch (mailError) {
            console.error("Mail Sending Failed:", mailError.message);
        }
        return res.redirect(`/users/verify-otp?email=${user.email}`);
    }
    catch (error) {
        console.error(error.message);
        return res.render('auth/register', { error: 'Something went wrong. Please try again.' });
    }
};

// 2. LOGIN USER
const loginUser = async (req, res)=>{
    try{
        let {email, password} = req.body;
        let user = await userModel.findOne({email});
        
        if(!user) {
            return res.render('auth/login', { error: 'User not found! Please check your email.' });
        }
        
        let isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.render('auth/login', { error: 'Wrong password! Please try again.' });
        }

        if (!user.isVerified) {
            return res.render('auth/login', { error: 'Your account is not verified! Please check your email for OTP.' });
        }

        await establishUserSession(req, user._id);

        return res.redirect('/products/allProducts');
    }
    catch(error){
        console.log(error.message);
        return res.render('auth/login', { error: 'Something went wrong. Please try again.' });
    }
};

// 3. GET VERIFY OTP PAGE
const getVerifyOtpPage = async (req, res) => {
    res.render('auth/verify-otp', { email: req.query.email, error: null });
};

// 4. POST VERIFY OTP LOGIC
const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.render('auth/verify-otp', { email, error: 'User not found!' });
        }

        if (!user.otp || user.otpExpires <= Date.now()) {
            return res.render('auth/verify-otp', { email, error: 'OTP has expired or is invalid! Please register again.' });
        }

        if (user.otpAttempts >= 5) {
            await userModel.findByIdAndUpdate(user._id, {
                $unset: { otp: 1, otpExpires: 1 },
                $set: { otpAttempts: 0 }
            });
            return res.render('auth/verify-otp', { email, error: 'Too many failed attempts. Please register again to get a new OTP.' });
        }

        if (user.otp !== otp) {
            const updatedAttempts = (user.otpAttempts || 0) + 1;
            if (updatedAttempts >= 5) {
                await userModel.findByIdAndUpdate(user._id, {
                    $unset: { otp: 1, otpExpires: 1 },
                    $set: { otpAttempts: 0 }
                });
                return res.render('auth/verify-otp', { email, error: 'Too many failed attempts. Your OTP has been invalidated. Please register again.' });
            } else {
                await userModel.findByIdAndUpdate(user._id, {
                    $set: { otpAttempts: updatedAttempts }
                });
                return res.render('auth/verify-otp', { email, error: `Invalid OTP! ${5 - updatedAttempts} attempts remaining. Please try again.` });
            }
        }

        await userModel.findByIdAndUpdate(user._id, {
            $set: { isVerified: true, otpAttempts: 0 },
            $unset: { otp: 1, otpExpires: 1 }
        });

        await establishUserSession(req, user._id);

        return res.redirect('/products/allProducts');
    } catch (error) {
        console.error(error.message);
        return res.status(500).render('error', {
            status: 500,
            message: "OTP Verification Error",
            detail: "An unexpected error occurred while verifying your OTP. Please try again.",
            buttonText: "Go Back",
            buttonLink: "/users/login"
        });
    }
};

// 5. FORGOT PASSWORD
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.render('auth/forgot-password', { 
                message: 'This email is not registered with us.', 
                type: 'error' 
            });
        }

        const token = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 Hour
        await user.save();

        const resetUrl = `${getBaseUrl(req)}/users/reset-password/${token}`;

        await sendmail(
            user.email,
            "KUSH MART - Password Reset Request",
            `<h2>Password Reset Request</h2>
             <p>Aapne KUSH MART अकाउंट का पासवर्ड रिसेट करने की रिक्वेस्ट की है।</p>
             <p>नीचे दिए गए लिंक पर क्लिक करके अपना नया पासवर्ड सेट करें (यह लिंक 1 घंटे तक वैलिड है):</p>
             <a href="${resetUrl}" style="background:#24963f; color:white; padding:10px 20px; text-decoration:none; border-radius:8px; display:inline-block; margin-top:10px;">Reset Password</a>
             <p>अगर आपने यह रिक्वेस्ट नहीं की है, तो इस ईमेल को इग्नोर करें।</p>`
        );

        return res.render('auth/forgot-password', { 
            message: 'A secure reset link has been sent to your email!', 
            type: 'success' 
        });

    } catch (error) {
        console.error(error.message);
        return res.render('auth/forgot-password', { message: 'Something went wrong. Try again.', type: 'error' });
    }
};

// 6. GET RESET PASSWORD 
const getResetPassword = async (req, res) => {
    try {
        const user = await userModel.findOne({
            resetPasswordToken: req.params.token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).render('error', {
                status: 400,
                message: "Link Expired or Invalid",
                detail: "The password reset link is invalid or has expired. Please request a new one.",
                buttonText: "Forgot Password",
                buttonLink: "/users/forgot-password"
            });
        }

        res.render('auth/reset-password', { token: req.params.token, message: null, type: null });
    } catch (error) {
        return res.status(500).render('error', {
            status: 500,
            message: "Internal Server Error",
            detail: "An unexpected error occurred. Please try again later.",
            buttonText: "Forgot Password",
            buttonLink: "/users/forgot-password"
        });
    }
};

// 7. POST RESET PASSWORD
const postResetPassword = async (req, res) => {
    try {
        const { password, confirmPassword } = req.body;

        if (password !== confirmPassword) {
            return res.render('auth/reset-password', { 
                token: req.params.token, 
                message: 'Passwords do not match.', 
                type: 'error' 
            });
        }

        const user = await userModel.findOne({
            resetPasswordToken: req.params.token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).render('error', {
                status: 400,
                message: "Link Expired",
                detail: "The reset token is invalid or has expired. Please try again.",
                buttonText: "Forgot Password",
                buttonLink: "/users/forgot-password"
            });
        }

        let salt = await bcrypt.genSalt(10);
        let hash = await bcrypt.hash(password, salt);

        user.password = hash;
        user.resetPasswordToken = undefined;  
        user.resetPasswordExpires = undefined; 
        await user.save();
        return res.redirect('/users/login');

    } catch (error) {
        console.error(error.message);
        return res.status(500).render('error', {
            status: 500,
            message: "Password Reset Failed",
            detail: "We were unable to reset your password. Please try again.",
            buttonText: "Forgot Password",
            buttonLink: "/users/forgot-password"
        });
    }
};

// 8. LOGOUT USER
const logoutUser = async (req, res) => {
    req.session.destroy((error) => {
        if (error) {
            console.error('Logout error:', error.message);
        }

        res.clearCookie('connect.sid');
        res.clearCookie('token');
        return res.redirect('/users/login');
    });
};

module.exports = {
    registerUser,
    loginUser,
    getVerifyOtpPage,
    verifyOtp,
    forgotPassword,
    getResetPassword,
    postResetPassword,
    logoutUser
};
