const express = require('express')
const app = express()
const cors = require('cors');
require('dotenv').config()
const stripe = require('stripe')(process.env.paymentSecretKey)

const port = process.env.PORT || 5000;

app.use(cors());;
app.use(express.json());


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.svs1tmw.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const myDB = client.db("taekwondo");
    const userColl = myDB.collection("users");
    const classColl = myDB.collection("classes");
    const selectedClassesColl = myDB.collection("selectedClasses");

    // Creating index on two fields
    // const indexKeys = { name: 1 }; // Replace field1 and field2 with your actual field names
    // const indexOptions = { name1: "toyname" }; // Replace index_name with the desired index name
    // const result = await myColl.createIndex(indexKeys, indexOptions);



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('running .................')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})