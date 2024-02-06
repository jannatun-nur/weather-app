const express= require('express')
const cors = require('cors')
const app = express();

const axios = require('axios')
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

const WEATHER_API_KEY = "016bcaa0473dcc15e28d1771a29849a0";



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://weather-app:owIzkUHlaMtgf4KT@cluster0.mrivhtb.mongodb.net/?retryWrites=true&w=majority";

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
    await client.connect();
    const userCollection = client.db("weather").collection("users")
    const weatherCollection = client.db("weather").collection("weathers")
    // -----------------------------------------------------------------------
// ABOUT ACTIVE USERS
// GET ALL MATHOD
app.get('/get-users' , async(req ,res)=>{
  const alllUser = await userCollection.find().sort({_id:-1}).toArray()
  res.send(alllUser)
 })

//  GET SINGLE USER
app.get('/one-user/:id', async(req ,res)=>{
  const id = req.params.id
  console.log(id);
  const query = {_id : new ObjectId(id)}
  const result = await userCollection.findOne(query)
  res.send(result)
 })

// POST MATHOD

app.post('/post-users' , async(req , res)=>{
  const activeUsers = req.body
  console.log('post done', activeUsers);
  const result = await userCollection.insertOne(activeUsers)
  res.send(result)
})

 // delete mathod
 app.delete('/dlt-user/:id' , async(req , res )=>{
  const id = req.params.id
  console.log(id);
  const query = {_id: new ObjectId(id)}
  const result = await userCollection.deleteOne(query)
  res.send(result);
})

// UPDATE MATHOD
app.put('/up-user/:id', async(req ,res)=>{
  const id = req.params.id
  const {updateUser} = req.body
  console.log(id ,updateUser);
  const filter = {_id: new ObjectId(id)}
  const options = {upsert:true}
  const result = await userCollection.updateOne(filter, { $set: { email: updateUser.email } }, options);
res.send(result)
 })

// -------------------------------------------------------------------------------
// WEATHER METHOD


app.get('/weather/:email', async (req, res) => {
  const email = req.params.email;
  console.log(email);
  const query = { email: email };
  const user = await userCollection.findOne(query);

  if (!user) {
    return res.status(404).send('User not found');
  }

  const address = user.address;
  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${address}&units=Metric&appid=${WEATHER_API_KEY}`;

  try {
    const weatherResponse = await axios.get(weatherUrl);
    res.send(weatherResponse.data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching weather data');
  }
});


app.post('/post-weather' , async(req , res)=>{
  const weather = req.body
  console.log('post done', weather);
  const result = await weatherCollection.insertOne(weather)
  res.send(result)
})

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("connect with mongodb successfully");


    

  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);





















app.get('/', (req, res)=>{
    res.send('weather is going well.')
})
app.listen(port, ()=>{
    console.log(`ok in git bash ${port}`);
})
