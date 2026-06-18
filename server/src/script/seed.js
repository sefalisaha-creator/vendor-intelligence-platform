require('dotenv').config();
const mongoose = require('mongoose');
const Vendor = require('../models/Vendor');
const Ledger = require('../models/Ledger');

const MONGO_URI = process.env.MONGO_URI;

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to database for seeding...');

    // Clear existing collections
    await Vendor.deleteMany({});
    await Ledger.deleteMany({});
    console.log('Cleared existing data.');

    // 1. Insert Vendors
    const vendorsData = [
      {
        name: 'Apex Facilities & Security Services',
        category: 'Facility Management',
        city: 'Kolkata',
        status: 'Strategic Partner',
        departmentsUsed: ['Operations', 'HR'],
        scorecard: { slaCompliance: 4.9, communication: 4.8, qualityOfService: 4.9 },
        activeContracts: [
          { contractId: 'CON-2026-001', startDate: new Date('2026-01-01'), endDate: new Date('2027-12-31'), description: 'Corporate HQ Security & Deep Cleaning' }
        ]
      },
      {
        name: 'Matrix Cloud & IT Solutions',
        category: 'Information Technology',
        city: 'Bangalore',
        status: 'Active',
        departmentsUsed: ['IT', 'Engineering'],
        scorecard: { slaCompliance: 4.5, communication: 4.2, qualityOfService: 4.4 },
        activeContracts: [
          { contractId: 'CON-2026-009', startDate: new Date('2025-06-01'), endDate: new Date('2026-06-30'), description: 'Expiring server migration asset deployment' }
        ]
      },
      {
        name: 'Reliable Haulers & Freight Co.',
        category: 'Logistics',
        city: 'Mumbai',
        status: 'Escalated',
        departmentsUsed: ['Supply Chain', 'Sales'],
        scorecard: { slaCompliance: 2.1, communication: 1.8, qualityOfService: 2.5 },
        activeContracts: [
          { contractId: 'CON-2025-044', startDate: new Date('2025-08-15'), endDate: new Date('2026-08-14'), description: 'Inter-state shipping distribution contract' }
        ]
      },
      {
        name: 'Nova Corporate Catering Services',
        category: 'Hospitality',
        city: 'Pune',
        status: 'Under Review',
        departmentsUsed: ['HR'],
        scorecard: { slaCompliance: 3.5, communication: 3.0, qualityOfService: 3.2 },
        activeContracts: [
          { contractId: 'CON-2026-012', startDate: new Date('2026-02-01'), endDate: new Date('2026-12-31'), description: 'Cafeteria management' }
        ]
      },
      {
        name: 'BlueSky Fleet Management',
        category: 'Logistics',
        city: 'Kolkata',
        status: 'Active',
        departmentsUsed: ['Operations'],
        scorecard: { slaCompliance: 4.2, communication: 4.5, qualityOfService: 4.0 },
        activeContracts: []
      },
      {
        name: 'Titan Corporate Law Associates',
        category: 'Legal Services',
        city: 'Mumbai',
        status: 'Strategic Partner',
        departmentsUsed: ['Legal', 'Finance'],
        scorecard: { slaCompliance: 5.0, communication: 4.9, qualityOfService: 5.0 },
        activeContracts: [
          { contractId: 'CON-2024-100', startDate: new Date('2024-01-01'), endDate: new Date('2029-01-01'), description: 'Long-term corporate advisory' }
        ]
      }
    ];

    const createdVendors = await Vendor.insertMany(vendorsData);
    console.log(`Successfully seeded ${createdVendors.length} vendors.`);

    // Map inserted entries to target with ledger instances
    const apexId = createdVendors.find(v => v.name.includes('Apex'))._id;
    const matrixId = createdVendors.find(v => v.name.includes('Matrix'))._id;
    const reliableId = createdVendors.find(v => v.name.includes('Reliable'))._id;

    // 2. Insert Experience Ledgers
    const ledgerData = [
      {
        vendorId: apexId,
        author: 'Suman Sen (Kolkata Operations)',
        entryType: 'Success Story',
        message: 'Handled our massive office relocation without a single broken asset. They worked overnight to ensure we were up and running by Monday morning. Truly elite partner.'
      },
      {
        vendorId: matrixId,
        author: 'IT Infrastructure Team',
        entryType: 'Review',
        message: 'Solid, reliable tech stack setup. Response time on server blips could be slightly quicker, but overall they hit their core deliverables well.'
      },
      {
        vendorId: reliableId,
        author: 'Logistics Dept (Mumbai Central)',
        entryType: 'Warning',
        message: 'DO NOT USE for time-sensitive client dispatches. They missed consecutive shipping deadlines this quarter, costing us critical buyer goodwill. Communication is completely non-existent during transit delays.'
      }
    ];

    await Ledger.insertMany(ledgerData);
    console.log('Successfully seeded Experience Ledger entries.');

    mongoose.connection.close();
    console.log('Database synchronization complete. Connection closed safely.');
  } catch (error) {
    console.error('Seeding process halted due to error:', error);
    process.exit(1);
  }
};

seedDatabase();