// Switch to CRM database
db = db.getSiblingDB('crm');

// Get admin user for reference
const adminUser = db.users.findOne({ email: 'admin@example.com' });

// Add more users
const users = db.users.insertMany([
  {
    email: 'manager@example.com',
    name: 'Sarah Wilson',
    role: 'manager',
    avatar: 'https://i.pravatar.cc/150?u=manager',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    email: 'sales1@example.com',
    name: 'John Smith',
    role: 'sales',
    avatar: 'https://i.pravatar.cc/150?u=sales1',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    email: 'sales2@example.com',
    name: 'Emma Davis',
    role: 'sales',
    avatar: 'https://i.pravatar.cc/150?u=sales2',
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

// Add companies
const companies = db.companies.insertMany([
  {
    name: 'TechCorp Solutions',
    industry: 'Technology',
    website: 'https://techcorp.example.com',
    size: '51-200',
    revenue: 5000000,
    status: 'customer',
    assignedTo: users.insertedIds[1], // John
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Global Manufacturing Inc',
    industry: 'Manufacturing',
    website: 'https://globalmanuf.example.com',
    size: '201-500',
    revenue: 20000000,
    status: 'prospect',
    assignedTo: users.insertedIds[2], // Emma
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Retail Dynamics',
    industry: 'Retail',
    website: 'https://retaildyn.example.com',
    size: '11-50',
    revenue: 2000000,
    status: 'partner',
    assignedTo: users.insertedIds[1], // John
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

// Add contacts
const contacts = db.contacts.insertMany([
  {
    firstName: 'Michael',
    lastName: 'Chen',
    email: 'mchen@techcorp.example.com',
    phone: '+1-555-0123',
    company: companies.insertedIds[0], // TechCorp
    title: 'CTO',
    status: 'active',
    assignedTo: users.insertedIds[1], // John
    lastContact: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    firstName: 'Lisa',
    lastName: 'Johnson',
    email: 'ljohnson@globalmanuf.example.com',
    phone: '+1-555-0124',
    company: companies.insertedIds[1], // Global Manufacturing
    title: 'Procurement Manager',
    status: 'lead',
    assignedTo: users.insertedIds[2], // Emma
    lastContact: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    firstName: 'David',
    lastName: 'Martinez',
    email: 'dmartinez@retaildyn.example.com',
    phone: '+1-555-0125',
    company: companies.insertedIds[2], // Retail Dynamics
    title: 'CEO',
    status: 'active',
    assignedTo: users.insertedIds[1], // John
    lastContact: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

// Add deals
const deals = db.deals.insertMany([
  {
    title: 'TechCorp Enterprise License',
    value: 100000,
    stage: 'negotiation',
    probability: 80,
    expectedCloseDate: new Date(new Date().setDate(new Date().getDate() + 30)),
    company: companies.insertedIds[0],
    contact: contacts.insertedIds[0],
    assignedTo: users.insertedIds[1],
    products: [
      { name: 'Enterprise License', quantity: 1, price: 100000 }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: 'Global Manufacturing Software Suite',
    value: 250000,
    stage: 'proposal',
    probability: 60,
    expectedCloseDate: new Date(new Date().setDate(new Date().getDate() + 45)),
    company: companies.insertedIds[1],
    contact: contacts.insertedIds[1],
    assignedTo: users.insertedIds[2],
    products: [
      { name: 'Core Suite', quantity: 1, price: 150000 },
      { name: 'Analytics Module', quantity: 1, price: 100000 }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

// Add tasks
db.tasks.insertMany([
  {
    title: 'Follow up on TechCorp proposal',
    description: 'Schedule a meeting to discuss enterprise license terms',
    status: 'Todo',
    priority: 'High',
    dueDate: new Date(new Date().setDate(new Date().getDate() + 2)),
    assignedTo: users.insertedIds[1],
    relatedTo: {
      type: 'deal',
      id: deals.insertedIds[0]
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: 'Prepare presentation for Global Manufacturing',
    description: 'Create ROI analysis and implementation timeline',
    status: 'In Progress',
    priority: 'High',
    dueDate: new Date(new Date().setDate(new Date().getDate() + 5)),
    assignedTo: users.insertedIds[2],
    relatedTo: {
      type: 'deal',
      id: deals.insertedIds[1]
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: 'Quarterly review with Retail Dynamics',
    description: 'Review partnership metrics and plan next quarter',
    status: 'Todo',
    priority: 'Medium',
    dueDate: new Date(new Date().setDate(new Date().getDate() + 10)),
    assignedTo: users.insertedIds[1],
    relatedTo: {
      type: 'company',
      id: companies.insertedIds[2]
    },
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

// Add activities
db.activities.insertMany([
  {
    type: 'call',
    title: 'Initial discovery call with TechCorp',
    description: 'Discussed enterprise license requirements and timeline',
    date: new Date(new Date().setDate(new Date().getDate() - 5)),
    duration: 45,
    status: 'completed',
    assignedTo: users.insertedIds[1],
    relatedTo: {
      type: 'deal',
      id: deals.insertedIds[0]
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    type: 'meeting',
    title: 'Software demo for Global Manufacturing',
    description: 'Presented core suite features and analytics capabilities',
    date: new Date(new Date().setDate(new Date().getDate() - 2)),
    duration: 90,
    status: 'completed',
    assignedTo: users.insertedIds[2],
    relatedTo: {
      type: 'deal',
      id: deals.insertedIds[1]
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    type: 'email',
    title: 'Sent proposal to TechCorp',
    description: 'Detailed pricing and terms for enterprise license',
    date: new Date(new Date().setDate(new Date().getDate() - 1)),
    duration: 0,
    status: 'completed',
    assignedTo: users.insertedIds[1],
    relatedTo: {
      type: 'deal',
      id: deals.insertedIds[0]
    },
    createdAt: new Date(),
    updatedAt: new Date()
  }
]); 