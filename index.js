const express = require('express')
const app = express()
const cors = require('cors');
require("dotenv").config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000


// middleware 
app.use(cors());
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
    const candidateCollection = database.collection("candidateCollection");
    const reviewCollection = database.collection("reviewCollection")
    const userCollection = database.collection("userCollection")
// get all colleges information from mongoDB 
    app.get("/colleges" , async(req , res)=>{
        const cursor = collegeCollection.find()
        const result = await cursor.toArray()
        res.send(result)
    })

     // get data using id 
     app.get("/colleges/:id" , async(req , res)=>{
        const id = req.params.id;
        try {
          const query = { _id: new ObjectId(id) };
          const result = await collegeCollection.findOne(query);
          if (result) {
            res.send(result);
          } else {
            res.status(404).send("College not found");
          }
        } catch (error) {
          console.error(error);
          res.status(500).send("Internal Server Error");
        }
      })


      app.get("/searchCollege/:text" , async(req , res) =>{
        const text = req.params.text ;
        const result = await collegeCollection
          .find({
            $or: [
              { name: { $regex: text, $options: "i" } }
            
            ],
          })
          .toArray();
          res.send(result)
      })

      // post candidate information 
      app.post("/candidate" , async(req, res)=>{
        const info = req.body
          console.log(info);
          const result = await candidateCollection.insertOne(info);
          res.send(result)
      })

      // get candidate information by email 
      app.get("/mycollege" , async(req , res)=>{
        let query = {};
        if(req.query?.email){
          query = {email:req.query.email}
        }
        const cursor = candidateCollection.find(query)
        const result = await cursor.toArray();
        res.send(result)
      })

      // post review information 
      app.post("/review" , async(req, res)=>{
        const info = req.body
          console.log(info);
          const result = await reviewCollection.insertOne(info);
          res.send(result)
      })

      // get review information 
      app.get("/review" , async(req , res)=>{
        const cursor = reviewCollection.find()
        const result = await cursor.toArray()
        res.send(result)
      })

      // post user information 
       app.post("/user" , async(req, res)=>{
        const info = req.body
          console.log(info);
          const result = await userCollection.insertOne(info);
          res.send(result)
      })

       // get review information 
       app.get("/user" , async(req , res)=>{
        let query = {};
        if(req.query?.email){
          query = {email:req.query.email}
        }
        const cursor = userCollection.find(query)
        const result = await cursor.toArray();
        res.send(result)
      })

      // get specific user id 
      app.get("/user/:id" , async(req, res)=>{
        const id = req.params.id 
        console.log(id);
        const query = {_id:new ObjectId(id)}
        const result = await userCollection.findOne(query)
        res.send(result)
      })

      // update user data 
      app.put("/user/:id" , async(req , res)=>{
        const id = req.params.id 
        const userInfo = req.body 
        const filter ={_id:new ObjectId(id)}
        const options ={upsert:true}
        const updateInfo = {
          $set: {
            
            name: userInfo.name,
            address: userInfo.address,
            college: userInfo.college,
          },
        }
        console.log(updateInfo);
        const result = await userCollection.updateOne(filter, updateInfo, options);
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