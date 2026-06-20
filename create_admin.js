const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const userModel = require('c:/Users/sir/OneDrive/Desktop/BackendAgain/Scatch/models/userModel');

async function main() {
  const mongoUrl = 'mongodb://localhost:27017/Scatch';
  console.log('Connecting to:', mongoUrl);
  await mongoose.connect(mongoUrl);
  
  const email = 'admin@kushmart.com';
  const password = 'adminPassword123';
  
  let user = await userModel.findOne({ email });
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  
  if (user) {
    user.password = hash;
    user.role = 'admin';
    user.isVerified = true;
    await user.save();
    console.log('Updated existing user to Admin:', email);
  } else {
    await userModel.create({
      name: 'KushMart Admin',
      email,
      password: hash,
      role: 'admin',
      isVerified: true,
      contact: 9999999999
    });
    console.log('Created new Admin user:', email);
  }
  
  await mongoose.disconnect();
}

main().catch(console.error);
