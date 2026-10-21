const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const User = require('./models/User');
const Stock = require('./models/Stock');
const Donation = require('./models/Donation');
const Request = require('./models/Request');
const Setting = require('./models/Setting');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    await User.deleteMany();
    await Stock.deleteMany();
    await Donation.deleteMany();
    await Request.deleteMany();
    await Setting.deleteMany();

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('password123', salt);

    // 1. Create Admin
    const admin = await User.create({
      name: 'System Administrator',
      email: 'admin@bloodbank.org',
      password: passwordHash,
      role: 'admin',
      bloodGroup: 'O+',
      dob: new Date('1990-01-01'),
      city: 'Mumbai',
      phone: '+91 9999900000',
    });

    // 2. Create 10 realistic Donor Users (various ages, cities, blood groups)
    const donors = await User.create([
      {
        name: 'Aarav Patel',
        email: 'aarav@gmail.com',
        password: passwordHash,
        role: 'donor',
        bloodGroup: 'A+',
        dob: new Date('1998-05-12'),
        city: 'Mumbai',
        phone: '+91 9820011111',
        lastDonationDate: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000), // 120 days ago (eligible)
      },
      {
        name: 'Sneha Reddy',
        email: 'sneha@gmail.com',
        password: passwordHash,
        role: 'donor',
        bloodGroup: 'O-',
        dob: new Date('2000-08-20'),
        city: 'Hyderabad',
        phone: '+91 9849022222',
        lastDonationDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago (ineligible - gap)
      },
      {
        name: 'Rohan Sharma',
        email: 'rohan@gmail.com',
        password: passwordHash,
        role: 'donor',
        bloodGroup: 'B+',
        dob: new Date('1995-02-14'),
        city: 'Delhi',
        phone: '+91 9811033333',
        lastDonationDate: null, // Never donated (eligible)
      },
      {
        name: 'Pooja Iyer',
        email: 'pooja@gmail.com',
        password: passwordHash,
        role: 'donor',
        bloodGroup: 'AB+',
        dob: new Date('2002-11-05'),
        city: 'Bengaluru',
        phone: '+91 9845044444',
        lastDonationDate: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000), // 100 days ago (eligible)
      },
      {
        name: 'Vikram Singh',
        email: 'vikram@gmail.com',
        password: passwordHash,
        role: 'donor',
        bloodGroup: 'O+',
        dob: new Date('1988-03-30'),
        city: 'Jaipur',
        phone: '+91 9829055555',
        lastDonationDate: new Date(Date.now() - 150 * 24 * 60 * 60 * 1000), // 150 days ago (eligible)
      },
      {
        name: 'Ananya Roy',
        email: 'ananya@gmail.com',
        password: passwordHash,
        role: 'donor',
        bloodGroup: 'A-',
        dob: new Date('2001-09-18'),
        city: 'Kolkata',
        phone: '+91 9830066666',
        lastDonationDate: null,
      },
      {
        name: 'Karan Mehra',
        email: 'karan@gmail.com',
        password: passwordHash,
        role: 'donor',
        bloodGroup: 'B-',
        dob: new Date('1994-07-22'),
        city: 'Pune',
        phone: '+91 9822077777',
        lastDonationDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000), // 45 days ago (ineligible - gap)
      },
      {
        name: 'Neha Gupta',
        email: 'neha@gmail.com',
        password: passwordHash,
        role: 'donor',
        bloodGroup: 'AB-',
        dob: new Date('2003-01-10'),
        city: 'Lucknow',
        phone: '+91 9839088888',
        lastDonationDate: null,
      },
      {
        name: 'Devansh Verma',
        email: 'devansh@gmail.com',
        password: passwordHash,
        role: 'donor',
        bloodGroup: 'O+',
        dob: new Date('2010-06-15'), // Under 18 years (ineligible - age)
        city: 'Chandigarh',
        phone: '+91 9815099999',
        lastDonationDate: null,
      },
      {
        name: 'Sunil Kumar',
        email: 'sunil@gmail.com',
        password: passwordHash,
        role: 'donor',
        bloodGroup: 'A+',
        dob: new Date('1955-04-12'), // Over 65 years (ineligible - age)
        city: 'Chennai',
        phone: '+91 9840010101',
        lastDonationDate: null,
      },
    ]);

    // 3. Initialize Stock with low-stock variation
    const stockData = [
      { bloodGroup: 'A+', unitsAvailable: 12 },
      { bloodGroup: 'A-', unitsAvailable: 3 }, // Low stock (<5)
      { bloodGroup: 'B+', unitsAvailable: 8 },
      { bloodGroup: 'B-', unitsAvailable: 2 }, // Low stock (<5)
      { bloodGroup: 'AB+', unitsAvailable: 6 },
      { bloodGroup: 'AB-', unitsAvailable: 1 }, // Low stock (<5)
      { bloodGroup: 'O+', unitsAvailable: 15 },
      { bloodGroup: 'O-', unitsAvailable: 4 }, // Low stock (<5)
    ];
    await Stock.insertMany(stockData);

    // 4. Default Setting for Donation Gap
    await Setting.create({
      key: 'minDonationGapDays',
      value: 90,
      description: 'Minimum days required between successive blood donations',
    });

    // 5. Seed sample donations
    await Donation.create([
      {
        donor: donors[0]._id,
        bloodGroup: 'A+',
        units: 1,
        donationDate: new Date(),
        recordedBy: admin._id,
      },
      {
        donor: donors[4]._id,
        bloodGroup: 'O+',
        units: 2,
        donationDate: new Date(),
        recordedBy: admin._id,
      },
    ]);

    // 6. Seed sample requests (Pending, Approved, Fulfilled)
    await Request.create([
      {
        requester: donors[0]._id,
        patientName: 'Kavita Patel',
        bloodGroup: 'A+',
        units: 2,
        hospital: 'Lilavati Hospital, Bandra',
        requiredByDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        status: 'Pending',
      },
      {
        requester: donors[2]._id,
        patientName: 'Ramesh Sharma',
        bloodGroup: 'B+',
        units: 1,
        hospital: 'AIIMS, New Delhi',
        requiredByDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        status: 'Approved',
      },
      {
        requester: donors[3]._id,
        patientName: 'Deepak Rao',
        bloodGroup: 'O+',
        units: 2,
        hospital: 'Manipal Hospital, Bengaluru',
        requiredByDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        status: 'Fulfilled',
      },
    ]);

    console.log('Database seeded successfully with 1 admin, 10 donors, stock records, and sample requests!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error.message);
    process.exit(1);
  }
};

seedData();
