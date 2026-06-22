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
            return res.status(400).json({
                success: false,
                message: "Both Name and Phone Number are required."
            });
        }

        const user = await userModel.findByIdAndUpdate(userId, {
            $set: { name: name, contact: Number(phone) }
        }, { new: true });

        res.json({
            success: true,
            message: "Profile updated successfully",
            name: user.name,
            contact: user.contact,
            email: user.email
        });
    } catch (error) {
        console.error("Profile Update Error:", error.message);
        res.status(500).json({
            success: false,
            message: "We encountered an unexpected error while saving your profile changes."
        });
    }
};

// ADD ADDRESS
const addAddress = async (req, res) => {
    try {
        const { title, flatNo, area, landmark, city, state, pincode } = req.body;

        const user = await userModel.findById(req.user._id);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        const newAddress = { title, flatNo, area, landmark, city, state, pincode };

        if (user.addresses.length === 0) {
            newAddress.isDefault = true;
        }

        user.addresses.push(newAddress);
        await user.save();

        res.json({
            success: true,
            message: "Address added successfully",
            addresses: user.addresses
        });
    } catch (err) {
        console.error("Address Addition Error:", err.message);
        res.status(500).json({
            success: false,
            message: "We were unable to add the new delivery address."
        });
    }
};

// DELETE ADDRESS
const deleteAddress = async (req, res) => {
    try {
        const userId = req.user._id;
        const addressId = req.params.addressId;

        const user = await userModel.findById(userId);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        const addressToDelete = user.addresses.find(addr => addr._id.toString() === addressId);
        const wasDefault = addressToDelete ? addressToDelete.isDefault : false;

        user.addresses = user.addresses.filter(item => item._id.toString() !== addressId);

        // If the deleted address was the default, set another one as default
        if (wasDefault && user.addresses.length > 0) {
            user.addresses[0].isDefault = true;
        }

        await user.save();

        return res.json({
            success: true,
            message: "Address deleted successfully",
            addresses: user.addresses
        });
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
        return res.json({
            success: true,
            message: "Primary address updated",
            addresses: user.addresses
        });
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

        const user = await userModel.findById(userId);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        const address = user.addresses.find(addr => addr._id.toString() === addressId);
        if (!address) return res.status(404).json({ success: false, message: "Address not found" });

        address.title = title;
        address.flatNo = flatNo;
        address.area = area;
        address.landmark = landmark;
        address.city = city;
        address.state = state;
        address.pincode = pincode;

        await user.save();

        res.json({
            success: true,
            message: "Address updated successfully",
            addresses: user.addresses
        });
    } catch (error) {
        console.error("Edit Address Error:", error.message);
        res.status(500).json({
            success: false,
            message: "We encountered an unexpected error while updating your address details."
        });
    }
};

// AUTOMATIC Locate Location via Google Maps (with OpenStreetMap fallback)
const fetchAddressFromGoogle = async (req, res) => {
    try {
        const { lat, lng } = req.query;
        if (!lat || !lng) {
            return res.status(400).json({ success: false, message: "Coordinates are missing" });
        }

        const apiKey = process.env.GOOGLE_MAPS_API_KEY;
        let useGoogle = false;
        let googleData;

        if (apiKey) {
            try {
                const googleUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;
                const response = await fetch(googleUrl);
                googleData = await response.json();
                if (googleData.status === "OK" && googleData.results && googleData.results.length > 0) {
                    useGoogle = true;
                } else {
                    console.warn("Google Geocoding API returned non-OK status:", googleData.status, googleData.error_message || "");
                }
            } catch (err) {
                console.error("Failed to query Google Geocoding API, falling back to OSM:", err.message);
            }
        } else {
            console.warn("Google Maps API Key is missing in environment variables, falling back to OSM.");
        }

        if (useGoogle && googleData) {
            const results = googleData.results;
            const addressComponents = results[0].address_components || [];

            let flatNoParts = [];
            let areaParts = [];
            let city = '';
            let state = '';
            let pincode = '';
            let landmark = '';

            for (const comp of addressComponents) {
                const types = comp.types;
                if (types.includes('subpremise') || types.includes('premise') || types.includes('building')) {
                    flatNoParts.push(comp.long_name);
                } else if (types.includes('street_number')) {
                    flatNoParts.unshift(comp.long_name);
                } else if (
                    types.includes('route') ||
                    types.includes('neighborhood') ||
                    types.includes('sublocality') ||
                    types.includes('sublocality_level_1') ||
                    types.includes('sublocality_level_2') ||
                    types.includes('sublocality_level_3')
                ) {
                    areaParts.push(comp.long_name);
                } else if (types.includes('locality')) {
                    city = comp.long_name;
                } else if (types.includes('administrative_area_level_2') && !city) {
                    city = comp.long_name;
                } else if (types.includes('administrative_area_level_1')) {
                    state = comp.long_name;
                } else if (types.includes('postal_code')) {
                    pincode = comp.long_name;
                } else if (
                    types.includes('point_of_interest') ||
                    types.includes('establishment') ||
                    types.includes('park') ||
                    types.includes('place_of_worship')
                ) {
                    landmark = comp.long_name;
                }
            }

            // Find landmark in all results if not found in results[0]
            if (!landmark) {
                for (const result of results) {
                    const found = result.address_components.find(c =>
                        c.types.includes('point_of_interest') ||
                        c.types.includes('establishment') ||
                        c.types.includes('park') ||
                        c.types.includes('place_of_worship') ||
                        c.types.includes('landmark')
                    );
                    if (found) {
                        landmark = found.long_name;
                        break;
                    }
                }
            }

            const formattedAddress = results[0].formatted_address || '';
            const addressPartsList = formattedAddress.split(',').map(s => s.trim());

            let flatNo = flatNoParts.join(', ').trim();
            if (!flatNo && addressPartsList.length > 0) {
                const firstPart = addressPartsList[0];
                if (firstPart !== city && firstPart !== state && firstPart !== pincode) {
                    flatNo = firstPart;
                }
            }
            if (!flatNo) {
                flatNo = 'Near Location';
            }

            let area = areaParts.join(', ').trim();
            if (!area && addressPartsList.length > 1) {
                area = addressPartsList.slice(1, Math.min(3, addressPartsList.length - 1)).join(', ');
            }
            if (!area) {
                area = 'Local Area';
            }

            if (!city) {
                city = 'Local City';
            }

            let addressInfo = {
                flatNo: flatNo,
                area: area,
                landmark: landmark ? landmark.trim() : '',
                city: city,
                state: state || '',
                pincode: pincode.trim()
            };

            return res.json({
                success: true,
                data: addressInfo
            });
        }

        // Fallback to OSM / Nominatim
        console.log("Geocoding: Querying OpenStreetMap reverse geocoding API.");
        const osmUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`;
        const osmResponse = await fetch(osmUrl, {
            headers: {
                'User-Agent': 'ApnaMartStore/1.0'
            }
        });
        const osmData = await osmResponse.json();

        if (!osmData || !osmData.address) {
            return res.json({ success: false, message: "Location details not found from any map provider." });
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
    fetchAddressFromGoogle
};
