import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/user.js';

// Load environment variables
dotenv.config();

const seedAdmin = async () => {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@gmail.com' });

    if (existingAdmin) {
      console.log('⚠️  Admin user already exists!');
      console.log('Email:', existingAdmin.email);
      console.log('Name:', existingAdmin.name);
      console.log('Is Admin:', existingAdmin.isAdmin);

      // Update password if needed
      console.log('\nUpdating password to: 123456');
      existingAdmin.password = '123456';
      await existingAdmin.save();
      console.log('✅ Admin password updated successfully');
    } else {
      // Create new admin user
      console.log('Creating new admin user...');

      const adminUser = await User.create({
        name: 'Admin User',
        email: 'admin@gmail.com',
        password: '123456',
        title: 'Administrator',
        role: 'Administrator',
        isAdmin: true,
        isActive: true
      });

      console.log('✅ Admin user created successfully!');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📧 Email:', adminUser.email);
      console.log('👤 Name:', adminUser.name);
      console.log('🔑 Password: 123456');
      console.log('🛡️  Is Admin:', adminUser.isAdmin);
      console.log('✅ Is Active:', adminUser.isActive);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    }

    // Close connection
    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
    console.log('\n🎉 Admin user is ready to use!');
    console.log('\nYou can now login with:');
    console.log('  Email: admin@gmail.com');
    console.log('  Password: 123456');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  }
};

// Run the seed function
seedAdmin();
