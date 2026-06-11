const crypto = require('crypto'); 
const userModel = require('../models/userModel');
const productModel = require('../models/productModel');
const bcrypt = require('bcrypt');
const sendmail = require('../utils/mailer');
const orderModel = require('../models/orderModel');
const ejs = require('ejs');
const path = require('path');

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

const getCartSummary = (user) => {
    let totalItems = 0;
    let totalCartPrice = 0;

    if (!user || !user.cart) {
        return { totalItems, totalCartPrice };
    }

    user.cart.forEach((item) => {
        if (!item.product) return;

        const quantity = Number(item.quantity || 1);
        const price = Number(item.product.price || 0);

        totalItems += 1;
        totalCartPrice += price * quantity;
    });

    return { totalItems, totalCartPrice };
};


// 1. REGISTER USER WITH OTP
const registerUser = async (req, res) => {
    try {
        let { name, email, password, contact } = req.body;
    
        let registeredUser = await userModel.findOne({ email });
        if (registeredUser) {
            return res.render('auth/register', { error: 'This email is already registered!' });
        }
        
        let salt = await bcrypt.genSalt(10);
        let hash = await bcrypt.hash(password, salt);
        
        const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = Date.now() + 600000; // OTP सिर्फ 10 मिनट के लिए वैलिड रहेगा

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
                hostUrl: `http://${req.headers.host}`,
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

// 7. GET VERIFY OTP PAGE
const getVerifyOtpPage = async (req, res) => {
    res.render('auth/verify-otp', { email: req.query.email, error: null });
};

// 8. POST VERIFY OTP LOGIC
const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.render('auth/verify-otp', { email, error: 'User not found!' });
        }

        if (user.otpExpires <= Date.now()) {
            return res.render('auth/verify-otp', { email, error: 'OTP has expired! Please register again.' });
        }

        if (user.otp !== otp) {
            return res.render('auth/verify-otp', { email, error: 'Invalid OTP! Please try again.' });
        }

        await userModel.findByIdAndUpdate(user._id, {
            $set: { isVerified: true },
            $unset: { otp: 1, otpExpires: 1 }
        });

        await establishUserSession(req, user._id);

        return res.redirect('/products/allProducts');
    } catch (error) {
        console.error(error.message);
        return res.status(500).send('Server Error');
    }
};

// 4. FORGOT PASSWORD
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

        // 1 घंटे के लिए एक सिक्योर रैंडम टोकन जनरेट करें
        const token = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 Hour from now
        await user.save();

        const resetUrl = `http://${req.headers.host}/users/reset-password/${token}`;

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

// 5. GET RESET PASSWORD 
const getResetPassword = async (req, res) => {
    try {
        const user = await userModel.findOne({
            resetPasswordToken: req.params.token,
            resetPasswordExpires: { $gt: Date.now() } // टोकन एक्सपायर न हुआ हो
        });

        if (!user) {
            return res.send('Password reset token is invalid or has expired. Request a new one.');
        }

        res.render('auth/reset-password', { token: req.params.token, message: null, type: null });
    } catch (error) {
        return res.status(500).send('Server Error');
    }
};

// 6. POST RESET PASSWORD - 
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
            return res.send('Token invalid or expired.');
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
        return res.status(500).send('Something went wrong');
    }
};

//  LOGOUT user 
const logoutUser = async (req, res) => {
    req.session.destroy((error) => {
        if (error) {
            console.error('Logout error:', error.message);
        }

        res.clearCookie('connect.sid');
        res.clearCookie('token');
        return res.redirect('/users/login');
    });
}

// ADD TO CART
const addToCart = async (req, res)=>{
    try{
        let user = await userModel.findById(req.user._id);
        let product = await productModel.findById(req.params.productId);
        
        if(!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        if(user.cart.some((i)=> i.product.toString() === product._id.toString())){
            return res.json({
                success: false,
                message: "Already in Cart"
            });
        }
        
        user.cart.push({
            product: product._id,
            quantity: 1
        });
        await user.save();

        user = await userModel.findById(user._id).populate('cart.product');
        
        res.json({
            success: true,
            message: "Added to Cart",
            cartSummary: getCartSummary(user)
        });
    }
    catch(error){
        console.error(error.message);
        res.status(500).json({ success: false, message: "Some Wrong" });
    }
};

//  REMOVE FROM CART
const removeToCart = async (req, res)=>{
    try{
        const user = await userModel.findById(req.user._id);
        
        if(!user){
            return res.status(401).json({ success: false, message: 'User not found' });
        }
        
        user.cart = user.cart.filter(item => item.product.toString() !== req.params.productId);
        await user.save();
        
        res.json({
            success: true,
            message: "Removed from cart"
        });
    }
    catch(error){
        console.error(error.message);
        res.status(500).json({ success: false, message: 'Something went wrong' });
    }
};

// 5. CART PRODUCTS PAGE
const cartProducts = async (req, res)=>{
    try{
        let user = await userModel.findById(req.user._id).populate('cart.product');

        if(!user){
            return res.redirect('/users/login');
        }
        let totalCartPrice = 0;
        const populatedUser = await userModel.findById(user._id).populate('cart.product');
        
        if (populatedUser && populatedUser.cart) {
            user.cart = populatedUser.cart.filter(item => item.product !== null);
            
            user.cart.forEach(item => {
                if (item.product && item.product.price) {
                    totalCartPrice += (Number(item.product.price) * Number(item.quantity || 1));
                }
            });
        }

        user.cart = user.cart.filter(item => item.product !== null);
        await user.save();

        let products = user.cart;
        res.render('cartProducts', {
            products: products, 
            user: user, 
            addresses: user.addresses,
            totalCartPrice: totalCartPrice
        });

    }
    catch (error) {
        console.error("Cart Controller Error:", error.message);
        res.status(500).send("Server Error");
    }
};

// 6. DECREASE QUANTITY
const descreaseQty = async (req, res)=>{
    try{
        let user = await userModel.findById(req.user._id).populate('cart.product');
        let productId = req.params.productId;
        
        let cartItem = user.cart.find(item => item.product._id.toString() === productId);

        if(!cartItem){
            return res.status(403).json({ success: false, message: "Product not found" });
        }

        if(cartItem.quantity > 1){
            cartItem.quantity -= 1;
            await user.save();
        }

        user = await userModel.findById(user._id).populate('cart.product');

        return res.json({
            success: true,
            quantity: cartItem.quantity,
            cartSummary: getCartSummary(user)
        });  
    }
    catch(error){
        console.log(error.message);
        res.json({ success: false, message: 'Some wrong...' });
    }
};

// 7. INCREASE QUANTITY (Updated with minimal edits)
const increaseQty = async (req, res)=>{
    try{
        let user = await userModel.findById(req.user._id).populate('cart.product');
        let productId = req.params.productId;
    
        let cartItem = user.cart.find(item => item.product._id.toString() === productId);
        
        if(cartItem){
            if (cartItem.quantity >= cartItem.product.stock) {
                return res.json({ success: false, isStockError: true, message: `Sorry, only ${cartItem.product.stock} units available.` });
            }

            cartItem.quantity += 1;
            await user.save();

            user = await userModel.findById(user._id).populate('cart.product');
    
            return res.json({
                success: true,
                quantity: cartItem.quantity,
                cartSummary: getCartSummary(user)
            });
        }   
        return res.status(404).json({ success: false, message: 'Product not found' });
    }
    catch(error){
        console.log(error.message);
        res.json({ success: false, message: 'Some wrong...' });
    }
};

// 1. CART CHECKOUT 
const cartCheckout = async (req, res) => {
    try {
        const user = await userModel.findById(req.user._id).populate('cart.product');
        
        if (!user || user.cart.length === 0) {
            return res.status(400).send("Your cart is empty!");
        }

        for (let item of user.cart) {
            if (!item.product) {
                return res.status(400).send("One of the products in your cart is no longer available.");
            }
            if (item.product.stock < item.quantity) {
                return res.status(400).send(`Sorry, only ${item.product.stock} units of "${item.product.name}" are left in stock.`);
            }
        }

        let totalCartPrice = user.cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
        
        const orderProducts = user.cart.map(item => ({
            product: item.product._id, 
            quantity: item.quantity,
        }));

        const deliveryAddress = req.body.address || "Main Address";

        let newOrder = await orderModel.create({
            user: user._id,
            products: orderProducts,   
            totalPrice: totalCartPrice,
            address: deliveryAddress,
        });
        const stockPromises = user.cart.map(item => {
            return productModel.findByIdAndUpdate(
                item.product._id,
                { $inc: { stock: -item.quantity } }
            );
        });
        
        await Promise.all(stockPromises);

        user.cart = [];
        await user.save();
    
        try {
            const templatePath = path.join(__dirname, '../views/emails/orderSuccess.ejs');
            const orderHtml = await ejs.renderFile(templatePath, {
                userName: user.name,
                orderId: newOrder._id,
                totalPrice: totalCartPrice,
                address: deliveryAddress,
                hostUrl: `http://${req.headers.host}`
            });

            await sendmail(
                user.email,
                `🛒 KUSH MART - Order Confirmed! (ID: ${newOrder._id.toString().slice(-6).toUpperCase()})`,
                orderHtml
            );
        } catch (mailError) {
            console.error("Order Mail Failed:", mailError.message);
        }

        res.redirect('/users/orders?success=true');
    }
    catch (error) {
        console.error("Critical Checkout Error:", error.message, error);
        res.status(500).send("Something went wrong while placing the order.");
    }
};

// 2. GET ORDERS (With Success Flash Notification Support)
const getOrders = async (req, res) => {
    try {
        const currentUser = await userModel.findById(req.user._id).populate('cart.product');
        
        let totalCartPrice = 0;
        if (currentUser && currentUser.cart && currentUser.cart.length > 0) {
            totalCartPrice = currentUser.cart.reduce((acc, item) => {
                if (item.product && item.product.price) {
                    return acc + (item.product.price * item.quantity);
                }
                return acc;
            }, 0);
        }

        let orders = await orderModel.find({ user: req.user._id })
                                     .populate('products.product')
                                     .sort({ createdAt: -1 }); 

        const isOrderSuccess = req.query.success === 'true';

        res.render('orders', { 
            orders, 
            user: currentUser,
            totalCartPrice,
            orderSuccessMessage: isOrderSuccess ? "Your order has been placed successfully! Track your order below." : null
        });

    } catch (error) {
        console.error("Error in getOrders:", error);
        res.status(500).send("Error fetching orders");
    }
};

const getBill = async (req, res)=>{
    try {
    const order = await orderModel.findById(req.params.orderId).populate('products.product');
    
    if (!order) {
      return res.status(404).send("Order not found");
    }

    let subtotal = order.totalPrice; 
    let deliveryCharge = subtotal > 500 ? 0 : 29; // मान लो 500 से ऊपर फ्री डिलीवरी
    let gst = Math.round(subtotal * 0.05); // 5% GST (अगर आप अलग से दिखाना चाहो)
    let finalBillAmount = subtotal + deliveryCharge;

    // 3. bill.ejs पेज को सारा डेटा भेज दो
    res.render('bill', { 
      user: req.user, 
      order, 
      subtotal, 
      deliveryCharge, 
      gst, 
      finalBillAmount 
    });

  } catch (error) {
    console.log('Error from userController getBill function ', error.message, error)
    res.status(500).send("Server Error");
  }
}

const getProfile = async(req, res)=>{
      try {
        const user = await userModel.findById(req.user._id);
        res.render('profile', { user });
      }
      catch (err) {
        console.log(err);
        res.status(500).send("Server Error");
      }
}

// Update profile
const updateProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const { name, phone } = req.body;

        if (!name || !phone) {
            return res.status(400).send("Name and Phone number are required");
        }

        // यूजर का नाम और फोन नंबर अपडेट करो
        await userModel.findByIdAndUpdate(userId, {
            $set: { name: name, phone: phone }
        });

        // अपडेट होने के बाद वापस प्रोफाइल पेज पर भेज दो
        res.redirect('/users/profile');
    } catch (error) {
        console.error("Profile Update Error:", error.message);
        res.status(500).send("Profile update karne me dikkat aayi");
    }
};

const addAddress = async (req, res)=>{
      try {
        const { title, flatNo, area, landmark, city, state, pincode } = req.body;
        
        const user = await userModel.findById(req.user._id);
        
        const newAddress = { title, flatNo, area, landmark, city, state, pincode };
        
        if (user.addresses.length === 0) {
          newAddress.isDefault = true;
        }

        user.addresses.push(newAddress);
        await user.save();
    
        res.redirect('/users/profile'); 
      } catch (err) {
        res.status(500).send("Address add karne me dikkat aayi");
      }
}

// DELETE ADDRESS
const deleteAddress = async (req, res) => {
    try {
        const userId = req.user._id; 
        const addressId = req.params.addressId; 

        await userModel.findByIdAndUpdate(userId, {
            $pull: { addresses: { _id: addressId } }
        });

        // फ्रंटएंड पर Fetch API को JSON रिस्पॉन्स भेजो
        return res.json({ success: true, message: "Address deleted successfully" });
    } catch (error) {
        console.error("Delete Address Error:", error.message);
        return res.status(500).json({ success: false, message: "Server error while deleting" });
    }
};

// SET PRIMARY/DEFAULT ADDRESS
const makeAddressPrimary = async (req, res) => {
    try {
        const userId = req.user._id;
        const addressId = req.params.addressId;

        const user = await userModel.findById(userId);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        user.addresses.forEach(addr => {
            if (addr._id.toString() === addressId) {
                addr.isDefault = true;
            } else {
                addr.isDefault = false;
            }
        });

        await user.save();
        return res.json({ success: true, message: "Primary address updated" });
    } catch (error) {
        console.error("Primary Address Error:", error.message);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

// EDIT ADDRESS
const editAddress = async (req, res) => {
    try {
        const userId = req.user._id;
        const addressId = req.params.addressId;
        const { title, flatNo, area, landmark, city, state, pincode } = req.body;

        await userModel.updateOne(
            { _id: userId, "addresses._id": addressId },
            {
                $set: {
                    "addresses.$.title": title,
                    "addresses.$.flatNo": flatNo,
                    "addresses.$.area": area,
                    "addresses.$.landmark": landmark,
                    "addresses.$.city": city,
                    "addresses.$.state": state,
                    "addresses.$.pincode": pincode
                }
            }
        );

        res.redirect('/users/profile');
    } catch (error) {
        console.error("Edit Address Error:", error.message);
        res.status(500).send("Address update karne me dikkat aayi");
    }
};

// AUTOMATIC Locate Location
const fetchAddressFromGoogle = async (req, res) => {
    try {
        const { lat, lng } = req.query;
        if (!lat || !lng) {
            return res.status(400).json({ success: false, message: "Coordinates are missing" });
        }

        // 🗺️ OpenStreetMap Reverse Geocoding API
        const osmUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`;

        const response = await fetch(osmUrl, {
            headers: {
                'User-Agent': 'ApnaMartStore/1.0'
            }
        });
        const osmData = await response.json();

        if (!osmData || !osmData.address) {
            return res.json({ success: false, message: "Location details not found" });
        }

        const addr = osmData.address;

        // 🎯 1. एरिया (Area) के लिए मजबूत फॉलबैक सिस्टम
        let calculatedArea = addr.road || addr.neighbourhood || addr.sublocality_level_1 || addr.sublocality || '';
        if (!calculatedArea) {
            calculatedArea = addr.suburb || addr.residential || addr.village || addr.city_district || addr.county || '';
        }

        // 🎯 2. लैंडमार्क (Landmark) के लिए सटीक चेकिंग
        let calculatedLandmark = osmData.display_name ? osmData.display_name.split(',')[0] : '';
        // अगर पहला शब्द रोड या शहर का नाम ही है, तो उसे लैंडमार्क नहीं मानेंगे, पास की कोई दुकान/इमारत ढूंढेंगे
        if (calculatedLandmark === addr.road || calculatedLandmark === addr.city || calculatedLandmark === addr.town) {
            calculatedLandmark = addr.amenity || addr.shop || addr.industrial || addr.commercial || '';
        }

        // 🎯 3. पिनकोड (Pincode) का परमानेंट इलाज (Regex Magic)
        let calculatedPincode = addr.postcode || '';
        
        // अगर OSM ने पिनकोड गलत दिया या नहीं दिया, तो पूरे एड्रेस (display_name) में से 6 डिजिट का नंबर ढूंढो
        if (!calculatedPincode || calculatedPincode.length !== 6 || isNaN(calculatedPincode)) {
            const fullAddress = osmData.display_name || '';
            // भारतीय पिनकोड 6 डिजिट का होता है और 1 से 9 के बीच शुरू होता है
            const pincodeMatch = fullAddress.match(/\b[1-9][0-9]{5}\mathrm{\b}/); 
            if (pincodeMatch) {
                calculatedPincode = pincodeMatch[0];
            }
        }

        // फाइनल ऑब्जेक्ट तैयार
        let addressInfo = {
            flatNo: addr.building || addr.house_number || 'Near Location',
            area: calculatedArea.trim(),
            landmark: calculatedLandmark ? calculatedLandmark.trim() : '',
            city: addr.city || addr.town || addr.village || addr.county || 'Local City',
            state: addr.state || '',
            pincode: calculatedPincode.trim()
        };

        // अगर एरिया फिर भी खाली रह जाए
        if (!addressInfo.area) {
            addressInfo.area = addr.state_district || 'Local Area';
        }

        // फ्रंटएंड को रिस्पॉन्स रवाना करो
        return res.json({
            success: true,
            data: addressInfo
        });

    } catch (error) {
        console.error("Geocoding Error:", error.message);
        return res.status(500).json({ success: false, message: "Server error during geocoding" });
    }
};


module.exports = {
    registerUser, loginUser, postResetPassword, getResetPassword, forgotPassword,getVerifyOtpPage, verifyOtp,
    addToCart, cartProducts, removeToCart,
    increaseQty, descreaseQty, logoutUser, cartCheckout, getOrders, getBill, getProfile,updateProfile,
    addAddress, deleteAddress, makeAddressPrimary, editAddress, fetchAddressFromGoogle
};
