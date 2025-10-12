const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("DevVault backend is running.");
});

app.use("/api/auth", require("./routes/authRoutes"));

const PORT = process.env.PORT || 5300;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
app.use("/api/resources", require("./routes/resourceRoutes"));
