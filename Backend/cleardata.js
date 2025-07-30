const mongoose = require('mongoose');
require('dotenv').config();

// Define the schemas exactly as they are in your index.js to target the correct collections
const profileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: { type: Number },
  userType: { type: String },
  type: { type: String, required: true },
  location: { type: String, required: true },
});

const accountSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

// Access the models
const Profile = mongoose.model('Profile', profileSchema);
const Account = mongoose.model('Account', accountSchema);

const clearDB = async () => {
    if (!process.env.MONGO_URI) {
        console.error("MONGO_URI not found in .env file.");
        return;
    }

    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB to clear data.");

        // Delete all documents from the 'profiles' collection
        const profileDeleteResult = await Profile.deleteMany({});
        console.log(`Successfully deleted ${profileDeleteResult.deletedCount} profiles.`);

        // Delete all documents from the 'accounts' collection
        const accountDeleteResult = await Account.deleteMany({});
        console.log(`Successfully deleted ${accountDeleteResult.deletedCount} accounts.`);
        
        console.log("Database collections are now empty. You can now create new accounts.");

    } catch (err) {
        console.error("Error clearing the database:", err);
    } finally {
        await mongoose.connection.close();
        console.log("MongoDB connection closed.");
    }
};

clearDB();
