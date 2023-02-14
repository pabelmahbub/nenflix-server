const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient,ObjectId } = require('mongodb');

require('dotenv').config();
const port = process.env.PORT || 8000

//middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.s8p6jkq.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
console.log('database is connected');

async function run() {
  try {
    const database = client.db("nenflix-server");
    const moviesCollection = database.collection("allMovies");
    
    app.get('/movies', async (req,res)=>{
      const query ={}
      const cursor = moviesCollection.find(query)
      const movies = await cursor.toArray(cursor);
      res.send(movies);

    } )
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log("Example app listening on port 5000")
})
