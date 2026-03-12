import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/user.js';

// Load environment variables
dotenv.config();

const testUsers = [
  {
    name: 'Admin User',
    email: 'admin@gmail.com',
    password: '123456',
    title: 'Administrator',
    role: 'Administrator',
    isAdmin: true,
    isActive: true
  },
  {
    name: 'Team Lead User',
    email: 'user2@gmail.com',
    password: 'user2@gmail.com',
    title: 'Team Lead',
    role: 'Team Lead',
    isAdmin: false,
    isActive: true
  },
  {
    name: 'Regular User',
    email: 'user@gmail.com',
    password: 'user@gmail.com',
    title: 'Developer',
    role: 'Developer',
    isAdmin: false,
    isActive: true
  }
];

const seedUsers = async () => {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB Atlas...');
    console.log('URI:', process.env.MONGODB_URI?.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@'));

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Creating/Updating Test Users...');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    for (const userData of testUsers) {
      const existingUser = await User.findOne({ email: userData.email });

      if (existingUser) {
        console.log(`⚠️  User ${userData.email} already exists`);

        // Update password
        existingUser.password = userData.password;
        existingUser.isActive = true;
        await existingUser.save();

        console.log(`✅ Updated: ${userData.name}`);
        console.log(`   Email: ${userData.email}`);
        console.log(`   Password: ${userData.password}`);
        console.log(`   Role: ${userData.role}`);
        console.log(`   Admin: ${userData.isAdmin}\n`);
      } else {
        const newUser = await User.create(userData);

        console.log(`✅ Created: ${userData.name}`);
        console.log(`   Email: ${userData.email}`);
        console.log(`   Password: ${userData.password}`);
        console.log(`   Role: ${userData.role}`);
        console.log(`   Admin: ${userData.isAdmin}\n`);
      }
    }

    // Summary
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎉 All test users are ready!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    console.log('📋 Login Credentials:\n');
    console.log('👑 Admin Account:');
    console.log('   Email: admin@gmail.com');
    console.log('   Password: 123456\n');

    console.log('👔 Team Lead Account:');
    console.log('   Email: user2@gmail.com');
    console.log('   Password: user2@gmail.com\n');

    console.log('👤 User Account:');
    console.log('   Email: user@gmail.com');
    console.log('   Password: user@gmail.com\n');

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('⚠️  IMPORTANT: Change these passwords in production!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Close connection
    await mongoose.connection.close();
    console.log('✅ Database connection closed');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  }
};

// Run the seed function
seedUsers();
