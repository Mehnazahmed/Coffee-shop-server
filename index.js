const express = require("express");
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port =process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.sn1j5xu.mongodb.net/?retryWrites=true&w=majority`;

console.log(uri)

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
    const coffeeCollection = client.db("coffeeStore").collection("coffee");

    app.post('/coffee', async(req,res)=>{
      const newCoffee =req.body;
      const result =await coffeeCollection.insertOne(newCoffee);
      res.send(result);
    });

    app.get('/coffee', async(req,res)=>{
      const result =await coffeeCollection.find().toArray();
      res.send(result);
    });
    app.get("/coffee/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await coffeeCollection.findOne(filter);
      res.send(result);
    });

    app.patch("/coffee/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updatedItem = req.body;
      const options ={upsert: true};
      const updateDoc = {
        $set: { coffeename:updatedItem.coffeename,
          chef:updatedItem.chef,
          supplier:updatedItem.supplier,
          taste:updatedItem.taste,
          category:updatedItem.category,
          details:updatedItem.details,
          photoUrl:updatedItem.photoUrl
        }
      };
      const result = await coffeeCollection.updateOne(filter, updateDoc,options);
      res.send(result);
    });

    app.delete("/coffee/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffeeCollection.deleteOne(query);
      res.send(result);
    });
    
   
  } finally {
    
  }
}
run().catch(console.dir);


app.get('/',async(req,res)=>{
    res.send('Coffee portal is running');
});



app.listen(port,()=>console.log(`Coffee portal running on ${port}`));