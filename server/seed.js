const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Category = require("./models/Category");

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

const seedCategories = async () => {
  const categories = [
    { name: "Web Development" },
    { name: "Mobile Development" },
    { name: "Data Science" },
    { name: "Machine Learning" },
    { name: "DevOps" },
    { name: "Cloud Computing" },
    { name: "Cybersecurity" },
    { name: "Blockchain" },
    { name: "Game Development" },
    { name: "AI" }
  ];

  try {
    await Category.insertMany(categories);
    console.log("Categories seeded successfully");
  } catch (error) {
    console.error("Error seeding categories:", error.message);
  } finally {
    mongoose.connection.close();
  }
};

connectDB().then(() => {
  seedCategories();
});
