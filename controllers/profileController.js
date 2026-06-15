const userModel = require('../models/userModel');

// GET PROFILE
const getProfile = async (req, res) => {
    try {
        const user = await userModel.findById(req.user._id);
        res.render('profile', { user });
    }
    catch (err) {
        console.log(err);
        res.status(500).render('error', {
            status: 500,
            message: "Profile Loading Failed",
            detail: "We encountered an error while loading your user profile details.",
            buttonText: "Go Back Home",
            buttonLink: "/"
        });
    }
};

// UPDATE PROFILE
const updateProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const { name, phone } = req.body;

        if (!name || !phone) {
            return res.status(400).render('error', {
                status: 400,
                message: "Missing Credentials",
                detail: "Both your Name and Phone Number are required parameters to update your profile.",
                buttonText: "My Profile",
                buttonLink: "/users/profile"
            });
        }

        await userModel.findByIdAndUpdate(userId, {
            $set: { name: name, contact: Number(phone) }
        });

        res.redirect('/users/profile');
    } catch (error) {
        console.error("Profile Update Error:", error.message);
        res.status(500).render('error', {
            status: 500,
            message: "Profile Update Failed",
            detail: "We encountered an unexpected error while saving your profile changes.",
            buttonText: "My Profile",
            buttonLink: "/users/profile"
        });
    }
};

// ADD ADDRESS
const addAddress = async (req, res) => {
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
        res.status(500).render('error', {
            status: 500,
            message: "Address Addition Failed",
            detail: "We were unable to add the new delivery address to your profile book.",
            buttonText: "My Profile",
            buttonLink: "/users/profile"
        });
    }
};

// DELETE ADDRESS
const deleteAddress = async (req, res) => {
    try {
        const userId = req.user._id;
        const addressId = req.params.addressId;

        await userModel.findByIdAndUpdate(userId, {
            $pull: { addresses: { _id: addressId } }
        });

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
        res.status(500).render('error', {
            status: 500,
            message: "Address Modification Failed",
            detail: "We encountered an unexpected error while updating your address details.",
            buttonText: "My Profile",
            buttonLink: "/users/profile"
        });
    }
};

// AUTOMATIC Locate Location
const fetchAddressFromOSM = async (req, res) => {
    try {
        const { lat, lng } = req.query;
        if (!lat || !lng) {
            return res.status(400).json({ success: false, message: "Coordinates are missing" });
        }

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

        let calculatedArea = addr.road || addr.neighbourhood || addr.sublocality_level_1 || addr.sublocality || '';
        if (!calculatedArea) {
            calculatedArea = addr.suburb || addr.residential || addr.village || addr.city_district || addr.county || '';
        }

        let calculatedLandmark = osmData.display_name ? osmData.display_name.split(',')[0] : '';
        if (calculatedLandmark === addr.road || calculatedLandmark === addr.city || calculatedLandmark === addr.town) {
            calculatedLandmark = addr.amenity || addr.shop || addr.industrial || addr.commercial || '';
        }

        let calculatedPincode = addr.postcode || '';

        if (!calculatedPincode || calculatedPincode.length !== 6 || isNaN(calculatedPincode)) {
            const fullAddress = osmData.display_name || '';
            const pincodeMatch = fullAddress.match(/\b[1-9][0-9]{5}\b/);
            if (pincodeMatch) {
                calculatedPincode = pincodeMatch[0];
            }
        }

        let addressInfo = {
            flatNo: addr.building || addr.house_number || 'Near Location',
            area: calculatedArea.trim(),
            landmark: calculatedLandmark ? calculatedLandmark.trim() : '',
            city: addr.city || addr.town || addr.village || addr.county || 'Local City',
            state: addr.state || '',
            pincode: calculatedPincode.trim()
        };

        if (!addressInfo.area) {
            addressInfo.area = addr.state_district || 'Local Area';
        }

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
    getProfile,
    updateProfile,
    addAddress,
    deleteAddress,
    makeAddressPrimary,
    editAddress,
    fetchAddressFromOSM
};
