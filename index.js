const express = require("express");
const cors = require("cors");
require("dotenv").config();
const bcrypt = require("bcrypt");
const { MongoClient } = require("mongodb");
const jwt = require("jsonwebtoken");
const generateToken = require("./utils/jwt");
const verifyToken = require("./middleware/verifyToken");

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection URL
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db("Dynamic-Dashboard");
    const userCollection = db.collection("users");
    const usersInfoCollection = db.collection("usersInfo");

    // Register Route
    app.post("/api/v1/register", async (req, res) => {
      const { username, email, password } = req.body;

      const existingUser = await userCollection.findOne({ email });
      if (existingUser) {
        return res
          .status(400)
          .json({ success: false, message: "User already exists!" });
      }

      const hashedPassword = await bcrypt.hash(password, 10); // data and salt arguments required

      await userCollection.insertOne({
        username,
        email,
        password: hashedPassword,
      });

      res
        .status(201)
        .json({ success: true, message: "User registered successfully!" });
    });

    // Login Route
    app.post("/api/v1/login", async (req, res) => {
      const { email, password } = req.body;

      const user = await userCollection.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const token = generateToken(user._id);

      res.json({
        success: true,
        message: "User successfully logged in!",
        accessToken: token,
      });
    });

    // ✅ Protected Route Example
    app.get("/api/v1/me", verifyToken, async (req, res) => {
      const userId = req.user.id;
      const user = await userCollection.findOne(
        { _id: new MongoClient.ObjectId(userId) },
        { projection: { password: 0 } }
      );

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({ success: true, user });
    });

    // add users data
    app.post("/api/v1/add-user-info", verifyToken, async (req, res) => {
      try {
        const { name, userEmail, phone, dob, status, authority } = req.body;

        if (!name || !userEmail || !phone || !dob || !status || !authority) {
          return res
            .status(400)
            .json({ success: false, message: "All fields are required." });
        }

        const newUser = {
          name,
          userEmail: userEmail, // saving as `email` in DB
          phone,
          dob,
          status,
          authority,
          createdAt: new Date(),
        };

        const result = await usersInfoCollection.insertOne(newUser);

        res
          .status(201)
          .json({ success: true, message: "User info added!", data: result });
      } catch (error) {
        console.error("Error inserting user info:", error);
        res.status(500).json({ success: false, message: "Server error" });
      }
    });

    // get users data
    app.get("/api/v1/get-users-info", verifyToken, async (req, res) => {
      try {
        const usersInfo = await usersInfoCollection.find().toArray();
        res.json({ success: true, data: usersInfo });
      } catch (error) {
        console.error("Error fetching user info:", error);
        res.status(500).json({ success: false, message: "Server error" });
      }
    });

    // Update users data
    const { ObjectId } = require("mongodb");

    app.put("/api/v1/update-user-info/:id", verifyToken, async (req, res) => {
      try {
        const { id } = req.params;
        // const { name, userEmail, phone, dob, status, authority } = req.body;
        // console.log(id);
        console.log(name, userEmail, phone, dob, status, authority);
        if (!name || !userEmail || !phone || !dob || !status || !authority) {
          return res
            .status(400)
            .json({ success: false, message: "All fields are required." });
        }

        const filter = { _id: new ObjectId(id) };
        const updateDoc = {
          $set: {
            name,
            userEmail,
            phone,
            dob,
            status,
            authority,
            updatedAt: new Date(),
          },
        };

        const result = await usersInfoCollection.updateOne(filter, updateDoc);

        if (result.matchedCount === 0) {
          return res
            .status(404)
            .json({ success: false, message: "User not found." });
        }

        res.json({
          success: true,
          message: "User info updated.",
          data: result,
        });
      } catch (error) {
        console.error("Error updating user info:", error);
        res.status(500).json({ success: false, message: "Server error" });
      }
    });

    // delete users data
    app.delete(
      "/api/v1/delete-user-info/:id",
      verifyToken,
      async (req, res) => {
        try {
          const { id } = req.params;

          if (!ObjectId.isValid(id)) {
            return res
              .status(400)
              .json({ success: false, message: "Invalid ID" });
          }

          const result = await usersInfoCollection.deleteOne({
            _id: new ObjectId(id),
          });

          if (result.deletedCount === 0) {
            return res
              .status(404)
              .json({ success: false, message: "User not found" });
          }

          res.json({ success: true, message: "User deleted", data: result });
        } catch (error) {
          console.error("Error deleting user:", error);
          res.status(500).json({ success: false, message: "Server error" });
        }
      }
    );
  } finally {
  }
}

run().catch(console.dir);

// Test route
app.get("/", (req, res) => {
  res.json({
    message: "Server is running smoothly",
    timestamp: new Date(),
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
