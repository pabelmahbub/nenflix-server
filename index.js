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

    app.get('/movies/:id', async (req,res)=>{
      const id = req.params.id;
      const query ={_id: new ObjectId(id)};
      const movie = await moviesCollection.findOne(query);
      res.send(movie);
    })

    app.post('/addMovie', async(req,res)=>{
      const post = req.body;
      console.log('post a movie');
      const cursor = await moviesCollection.insertOne(post);
      res.send(cursor);
    })

    app.delete('/manageMovie/:id',async(req,res)=>{
      const id = req.params.id;
      const query = {_id:ObjectId(id)};
      const result = await moviesCollection.deleteOne(query);
      res.json(result);
    })

    
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
