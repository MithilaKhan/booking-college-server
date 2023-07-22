const express = require('express')
const app = express()
var cors = require('cors')
require("dotenv").config()
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000


// middleware 
app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.BookingCollege_NAME}:${process.env.BookingCollege_PASS}@cluster0.1n864lk.mongodb.net/?retryWrites=true&w=majority`;




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
    client.connect();

    const database = client.db("BookingCollege");
    const collegeCollection = database.collection("collageCollection");


    app.get("/colleges" , async(req , res)=>{
        const cursor = collegeCollection.find()
        const result = await cursor.toArray()
        res.send(result)
    })

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
  res.send('Booking your favorite college with DREAM platform ')
})

app.listen(port, () => {
  console.log(`Booking College on port ${port}`)
})