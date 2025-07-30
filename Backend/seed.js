const mongoose = require('mongoose');
const fs = require('fs'); // Node.js File System module
const path = require('path'); // Node.js Path module
require('dotenv').config();

// This schema MUST EXACTLY MATCH the one in your index.js
const profileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number },
  avatar: { type: String },
  isVerified: { type: Boolean, default: false },
  lastActive: { type: String, default: 'Online' },
  userType: { type: String, enum: ['student', 'professional', 'owner'] },
  intent: { type: String, enum: ['looking-for-flat', 'looking-for-flatmate', 'have-flat-need-flatmate'] },
  gender: { type: String, enum: ['male', 'female', 'any'] },
  college: { type: String },
  course: { type: String },
  year: { type: String },
  company: { type: String },
  jobTitle: { type: String },
  workLocation: { type: String },
  location: { type: String, required: true },
  budget: { type: String },
  roomType: { type: String },
  moveInDate: { type: String },
  stayDuration: { type: String },
  phone: { type: String },
  email: { type: String, required: true, unique: true },
  description: { type: String },
  habits: { type: [String] },
  amenities: { type: [String] },
  restrictions: { type: [String] },
  verifications: { phone: { type: Boolean, default: false }, email: { type: Boolean, default: false }, college: { type: Boolean, default: false }, identity: { type: Boolean, default: false } },
  type: { type: String, enum: ['flatmate', 'flat'], required: true },
  image: { type: String },
  tags: { type: [String] },
  compatibility: { type: Number },
}, { timestamps: true });

const Profile = mongoose.model('Profile', profileSchema);

// --- Seeding Function ---
const seedDB = async () => {
    try {
        // Connect to the database
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB for seeding.");

        // Clear any existing data from the Profile collection
        await Profile.deleteMany({});
        console.log("Cleared existing profiles.");

        // Read the data.json file
        const jsonPath = path.join(__dirname, 'data.json');
        const profilesData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
        console.log(`Found ${profilesData.length} profiles in data.json.`);

        // Insert the new data from the file
        await Profile.insertMany(profilesData);
        console.log("Database seeded successfully from data.json!");

    } catch (err) {
        console.error("Error seeding database:", err);
    } finally {
        // Always close the connection
        mongoose.connection.close();
        console.log("MongoDB connection closed.");
    }
};

// Run the seeding function
seedDB();
