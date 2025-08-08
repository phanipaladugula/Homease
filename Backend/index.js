// Import necessary Node.js modules
const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs'); // File System module to read local files
const path = require('path'); // Path module to handle file paths
const cors = require('cors');
require('dotenv').config();

// Initialize the Express app
const app = express();

// --- Middleware ---
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// --- Database Connection ---
const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI)
  .then(() => {
    console.log('Successfully connected to MongoDB Atlas!');
    initializeDatabase(); 
  })
  .catch(err => console.error('Error connecting to MongoDB:', err));

// --- Define Mongoose Schemas ---
const profileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  age: { type: Number },
  gender: { type: String, enum: ['male', 'female', 'other', 'any'] },
  userType: { type: String, enum: ['student', 'professional', 'owner', 'broker'] },
  location: { type: String, required: true },
  college: { type: String },
  course: { type: String },
  year: { type: String },
  company: { type: String },
  jobTitle: { type: String },
  workLocation: { type: String },
  intent: { type: String },
  budget: { type: String },
  roomType: { type: String },
  moveInDate: { type: String },
  stayDuration: { type: String },
  habits: { type: [String] },
  description: { type: String },
  propertyTypes: { type: [String] },
  listingLocations: { type: String },
  type: { type: String, enum: ['flatmate', 'flat'], required: true },
  image: { type: String },
  avatar: { type: String }, 
  tags: { type: [String] },
  compatibility: { type: Number },
  amenities: { type: [String] },
  restrictions: { type: [String] },
  businessName: { type: String },
  businessType: { type: String },
  experience: { type: String },
  flatType: { type: String },
  furnishing: { type: String },
  verifications: {
    phone: { type: Boolean, default: false },
    email: { type: Boolean, default: false },
    college: { type: Boolean, default: false },
    identity: { type: Boolean, default: false }
  },
  postedBy: {
    name: { type: String },
    email: { type: String },
    phone: { type: String }
  }
}, { timestamps: true });

const accountSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

const Profile = mongoose.model('Profile', profileSchema);
const Account = mongoose.model('Account', accountSchema);

// --- Function to Initialize Database with data.json ---
const initializeDatabase = async () => {
    try {
        const profileCount = await Profile.countDocuments();
        if (profileCount > 0) {
            console.log('Database already contains profiles. Skipping initialization.');
            return;
        }

        console.log('Database is empty. Initializing with data from data.json...');
        
        const dataFilePath = path.join(__dirname, 'data.json');
        if (!fs.existsSync(dataFilePath)) {
            console.log('data.json not found. No initial data will be added.');
            return;
        }
        const fileContent = fs.readFileSync(dataFilePath, 'utf8');
        const sampleProfiles = JSON.parse(fileContent); 

        await Profile.insertMany(sampleProfiles);
        
        const sampleAccounts = sampleProfiles.map(profile => ({
            email: profile.email,
            password: 'password123'
        }));
        await Account.insertMany(sampleAccounts);

        console.log(`Successfully added ${sampleProfiles.length} profiles and accounts to the database.`);

    } catch (error) {
        console.error('Error during database initialization:', error);
    }
};

// --- API Routes (Endpoints) ---

// GET all profiles
app.get('/api/profiles', async (req, res) => {
  try {
    const profiles = await Profile.find();
    res.json(profiles);
  } catch (error) {
    res.status(500).json({ message: 'Server error retrieving profiles' });
  }
});

// GET a single profile by ID
app.get('/api/profiles/:id', async (req, res) => {
    try {
        const profile = await Profile.findById(req.params.id);
        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }
        res.json(profile);
    } catch (err) {
        res.status(500).json({ message: 'Server error retrieving profile' });
    }
});

// GET a single profile by email
app.get('/api/profiles/email/:email', async (req, res) => {
    try {
        const profile = await Profile.findOne({ email: req.params.email });
        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }
        res.json(profile);
    } catch (err) {
        console.error(`Error fetching profile for email ${req.params.email}:`, err);
        res.status(500).json({ message: 'Server error retrieving profile' });
    }
});

// POST (Create) a new profile and account
app.post('/api/profiles', async (req, res) => {
  console.log("Received signup/post request with body:", req.body);

  const { email, password, ...profileData } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required.' });
  }

  try {
    // If a password is provided, it's a new user signup, so create an account
    if (password) {
        const existingAccount = await Account.findOne({ email });
        if (existingAccount) {
          return res.status(400).json({ message: 'An account with this email already exists.' });
        }
        const newAccount = new Account({ email, password });
        await newAccount.save();
    }

    const newProfile = new Profile({ email, ...profileData });
    await newProfile.save();

    res.status(201).json({ message: 'Profile created successfully!', profile: newProfile });

  } catch (error) {
    console.error("Error creating profile:", error);
    res.status(500).json({ message: 'Error creating profile', error: error.message });
  }
});

// PUT (Update) an existing profile
app.put('/api/profiles/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const updatedProfile = await Profile.findByIdAndUpdate(id, updatedData, { new: true });

    if (!updatedProfile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.status(200).json({ message: 'Profile updated successfully!', profile: updatedProfile });

  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
});

// POST login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const userAccount = await Account.findOne({ email });
    if (!userAccount || userAccount.password !== password) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }
    const userProfile = await Profile.findOne({ email });
    if (!userProfile) {
      return res.status(404).json({ message: 'User profile not found.' });
    }
    // On successful login, return the full profile
    res.status(200).json({ message: 'Login successful!', profile: userProfile });
  } catch (error) {
    res.status(500).json({ message: 'Server error during login' });
  }
});

// POST verify phone
app.post('/api/profiles/verify-phone', async (req, res) => {
    const { email, phone } = req.body;

    if (!email || !phone) {
        return res.status(400).json({ message: 'Email and phone number are required.' });
    }

    try {
        const updatedProfile = await Profile.findOneAndUpdate(
            { email: email }, 
            { 
                $set: { 
                    phone: phone, 
                    'verifications.phone': true 
                } 
            },
            { new: true }
        );

        if (!updatedProfile) {
            return res.status(404).json({ message: 'Profile not found for this email.' });
        }

        res.status(200).json({ message: 'Phone number verified and updated successfully.', profile: updatedProfile });

    } catch (error) {
        console.error("Error updating phone verification:", error);
        res.status(500).json({ message: 'Server error during phone verification update.' });
    }
});


// --- Start the Server ---
const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});