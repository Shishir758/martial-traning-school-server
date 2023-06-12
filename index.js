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

    //get data using user's email
 app.get('/users/:email', async (req, res) => {
      const result = await userColl.find({email: req.params.email }).toArray();
      res.json(result)
    })

    //get all classes data
    app.get('/classes', async (req, res) => {
      const result = await classColl.find().limit(20).toArray();
      res.json(result);
    })
    app.get('/selectedClasses/:email', async (req, res) => {
      const email = req.params.email;
      try {
        const result = await selectedClassesColl.find({ email: email }).toArray();
        res.json(result);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred' });
      }
    });

//Get all user's data
    app.get('/users', async (req, res) => {
      const result = await userColl.find().toArray();
      res.json(result);
    })

    //update role status
    app.patch('/classes/:id', (req, res) => {
      const id = req.params.id;
      const updatedStatus = req.body;
    
      classColl
        .findOneAndUpdate(
          { _id: new ObjectId(id) },
          { $set: { status: updatedStatus.status } },
          { returnOriginal: false }
        )
        .then(updatedDocument => {
          res.json(updatedDocument.value);
        
        })
        .catch(error => {
          console.error(error);
          res.status(500).json({ message: 'Error updating data' });
        });
    });

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