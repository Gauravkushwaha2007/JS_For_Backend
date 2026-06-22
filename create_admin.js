const bcrypt = require('bcrypt');
const userModel = require('./models/userModel');
const db = require('./config/dbConnection');

async function main() {
  await new Promise((resolve, reject) => {
    if (db.readyState === 1) return resolve();
    db.once('connected', resolve);
    db.once('error', reject);
  });
  console.log('Connected to database!');
  
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
}

main()
  .then(() => {
    console.log('Done');
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
