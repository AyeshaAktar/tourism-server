const express = require("express");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;

const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.szoou.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

// console.log(uri);

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    // console.log("connected to database");
    const database = client.db("tourism");
    const campingsCollection = database.collection("campings");
    const bookingCollection = database.collection("booking");

    //GET API
    app.get("/campings", async (req, res) => {
      const cursor = campingsCollection.find({});
      const campings = await cursor.toArray();
      res.send(campings);
    });

    //GET Single Camping
    app.get("/campings/:id", async (req, res) => {
      const id = req.params.id;
      console.log("getting specifing camping", id);
      const query = { _id: ObjectId(id) };
      const camping = await campingsCollection.findOne(query);
      res.json(camping);
    });

    //POST API
    app.post("/campings", async (req, res) => {
      const camping = req.body;
      console.log("hit the post api", camping);

      const result = await campingsCollection.insertOne(camping);
      console.log(result);
      res.json(result);
    });

    //Booking POST API
    app.post("/bookings", async (req, res) => {
      const booking = req.body;
      // console.log("hit the post api", camping);
      const result = await bookingCollection.insertOne(booking);
      console.log(result);
      res.json(result);
    });

    //Booking GET API
    app.get("/bookings", async (req, res) => {
      const cursor = bookingCollection.find({});
      const booking = await cursor.toArray();
      res.send(booking);
    });
    //DELETE API
    app.delete("/DeleteBookings/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await bookingCollection.deleteOne(query);
      res.json(result);
    });

    app.get("/orderEmail", (req, res) => {
      bookingCollection
        .find({ email: req.query.email })
        .toArray((err, documents) => {
          res.send(documents);
        });
    });
  } finally {
    // await client.close()
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Running Tourism Server");
});

app.listen(port, () => {
  // console.log(`Example app listening at http://localhost:${port}`);
  console.log("Running Camping Village on port", port);
});
