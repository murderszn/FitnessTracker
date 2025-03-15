// Switch to our CRM database
db = db.getSiblingDB('crm');

// Drop existing collections to start fresh
db.contacts.drop();
db.companies.drop();
db.deals.drop();
db.tasks.drop();
db.activities.drop();
db.users.drop();

// Create Users collection with validation
db.createCollection('users', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['email', 'name', 'role', 'createdAt'],
      properties: {
        email: {
          bsonType: 'string',
          pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'
        },
        name: { bsonType: 'string' },
        role: { enum: ['admin', 'manager', 'sales'] },
        avatar: { bsonType: 'string' },
        createdAt: { bsonType: 'date' },
        updatedAt: { bsonType: 'date' }
      }
    }
  }
});

// Create Contacts collection with validation
db.createCollection('contacts', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['firstName', 'lastName', 'email', 'createdAt'],
      properties: {
        firstName: { bsonType: 'string' },
        lastName: { bsonType: 'string' },
        email: {
          bsonType: 'string',
          pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'
        },
        phone: { bsonType: 'string' },
        company: { bsonType: 'objectId' },
        title: { bsonType: 'string' },
        status: { enum: ['active', 'inactive', 'lead'] },
        assignedTo: { bsonType: 'objectId' },
        lastContact: { bsonType: 'date' },
        createdAt: { bsonType: 'date' },
        updatedAt: { bsonType: 'date' }
      }
    }
  }
});

// Create Companies collection with validation
db.createCollection('companies', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['name', 'createdAt'],
      properties: {
        name: { bsonType: 'string' },
        industry: { bsonType: 'string' },
        website: { bsonType: 'string' },
        size: { enum: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'] },
        revenue: { bsonType: 'number' },
        status: { enum: ['prospect', 'customer', 'partner'] },
        assignedTo: { bsonType: 'objectId' },
        createdAt: { bsonType: 'date' },
        updatedAt: { bsonType: 'date' }
      }
    }
  }
});

// Create Deals collection with validation
db.createCollection('deals', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['title', 'value', 'stage', 'createdAt'],
      properties: {
        title: { bsonType: 'string' },
        value: { bsonType: 'number' },
        stage: { enum: ['lead', 'qualified', 'proposal', 'negotiation', 'closed_won', 'closed_lost'] },
        probability: { bsonType: 'number' },
        expectedCloseDate: { bsonType: 'date' },
        company: { bsonType: 'objectId' },
        contact: { bsonType: 'objectId' },
        assignedTo: { bsonType: 'objectId' },
        products: {
          bsonType: 'array',
          items: {
            bsonType: 'object',
            required: ['name', 'quantity', 'price'],
            properties: {
              name: { bsonType: 'string' },
              quantity: { bsonType: 'number' },
              price: { bsonType: 'number' }
            }
          }
        },
        createdAt: { bsonType: 'date' },
        updatedAt: { bsonType: 'date' }
      }
    }
  }
});

// Create Tasks collection with validation
db.createCollection('tasks', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['title', 'status', 'createdAt'],
      properties: {
        title: { bsonType: 'string' },
        description: { bsonType: 'string' },
        status: { enum: ['Todo', 'In Progress', 'Review', 'Done'] },
        priority: { enum: ['High', 'Medium', 'Low'] },
        dueDate: { bsonType: 'date' },
        assignedTo: { bsonType: 'objectId' },
        relatedTo: {
          bsonType: 'object',
          properties: {
            type: { enum: ['contact', 'company', 'deal'] },
            id: { bsonType: 'objectId' }
          }
        },
        createdAt: { bsonType: 'date' },
        updatedAt: { bsonType: 'date' }
      }
    }
  }
});

// Create Activities collection with validation
db.createCollection('activities', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['type', 'title', 'createdAt'],
      properties: {
        type: { enum: ['call', 'email', 'meeting', 'task'] },
        title: { bsonType: 'string' },
        description: { bsonType: 'string' },
        date: { bsonType: 'date' },
        duration: { bsonType: 'number' },
        status: { enum: ['completed', 'scheduled', 'cancelled'] },
        assignedTo: { bsonType: 'objectId' },
        relatedTo: {
          bsonType: 'object',
          properties: {
            type: { enum: ['contact', 'company', 'deal'] },
            id: { bsonType: 'objectId' }
          }
        },
        createdAt: { bsonType: 'date' },
        updatedAt: { bsonType: 'date' }
      }
    }
  }
});

// Create indexes
db.contacts.createIndex({ email: 1 }, { unique: true });
db.contacts.createIndex({ company: 1 });
db.contacts.createIndex({ assignedTo: 1 });

db.companies.createIndex({ name: 1 }, { unique: true });
db.companies.createIndex({ assignedTo: 1 });

db.deals.createIndex({ company: 1 });
db.deals.createIndex({ contact: 1 });
db.deals.createIndex({ assignedTo: 1 });
db.deals.createIndex({ stage: 1 });

db.tasks.createIndex({ assignedTo: 1 });
db.tasks.createIndex({ status: 1 });
db.tasks.createIndex({ dueDate: 1 });

db.activities.createIndex({ type: 1 });
db.activities.createIndex({ date: 1 });
db.activities.createIndex({ assignedTo: 1 });

// Insert sample user
db.users.insertOne({
  email: 'admin@example.com',
  name: 'Admin User',
  role: 'admin',
  avatar: 'https://i.pravatar.cc/150?u=admin',
  createdAt: new Date(),
  updatedAt: new Date()
}); 