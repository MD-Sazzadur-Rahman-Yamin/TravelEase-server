const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const app = express();

const port = process.env.PORT || 3333;

// Middlewere
app.use(cors());
app.use(express.json());

// MongoDB
const uri = `mongodb+srv://${process.env.db_USER}:${process.env.db_PASSWORD}@cluster0.zzj1wzu.mongodb.net/?appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

//API
app.get("/", (req, res) => {
  res.send("TrevelEase-server is running");
});

app.listen(port, () => {
  console.log(`TrevelEase-server is running on port: ${port}`);
});

//MongoDB API
async function run() {
  try {
    // await client.connect();

    const db = client.db("travelEase-DB");
    const vehicleColl = db.collection("vehicles");
    const bookingColl = db.collection("booking");
    const usersColl = db.collection("users");

    //vehicles
    app.get("/vehicle", async (req, res) => {
      const userEmail = req.query.userEmail;
      const query = {};
      if (userEmail) {
        query.userEmail = userEmail;
      }
      const cursor = vehicleColl.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/vehicle/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await vehicleColl.findOne(query);
      res.send(result);
    });

    app.get("/latest-vehicle", async (req, res) => {
      const cursor = vehicleColl.find().sort({ createdAt: -1 }).limit(6);
      const result = await cursor.toArray();
      res.send(result);
    });

    app.post("/vehicle", async (req, res) => {
      const newVehicle = req.body;
      const result = await vehicleColl.insertOne(newVehicle);
      res.send(result);
    });

    app.patch("/vehicle/:id", async (req, res) => {
      const id = req.params.id;
      const updatedVehicle = req.body;
      const query = { _id: new ObjectId(id) };
      const update = { $set: updatedVehicle };
      const option = {};
      const result = await vehicleColl.updateOne(query, update, option);
      res.send(result);
    });

    app.delete("/vehicle/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await vehicleColl.deleteOne(query);
      res.send(result);
    });

    //Booking API

    app.get("/booking", async (req, res) => {
      const userEmail = req.query.userEmail;
      const query = {};
      if (userEmail) {
        query.userEmail = userEmail;
      }
      const cursor = bookingColl.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    app.patch("/booking", async (req, res) => {
      const newBooking = req.body;
      const result = await bookingColl.insertOne(newBooking);
      res.send(result);
    });

    app.delete("/booking/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await bookingColl.deleteOne(query);
      res.send(result);
    });

    //Users API

    app.post("/users", async (req, res) => {
      const newUser = req.body;
      const email = req.body.email;
      const query = { email: email };
      const existingUser = await usersColl.findOne(query);
      if (existingUser) {
        res.send("User already exits. Do not need to insert again");
      } else {
        const result = await usersColl.insertOne(newUser);
        res.send(result);
      }
    });
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
  }
}
run().catch(console.dir);
