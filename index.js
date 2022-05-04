const express = require('express');
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();


// Middleware

app.use(cors());
app.use(express.json());


// APIs



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qnrec.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const placesCollection = client.db('tour-places').collection('tour-guide');

        app.get('/places', async (req, res) => {
            const query = {};
            const cursor = placesCollection.find(query);
            const places = await cursor.toArray();
            res.send(places);
        })
        
        app.get('/places/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id:ObjectId(id)};
            const place = await placesCollection.findOne(query);
            res.send(place);
        })
        
        app.delete('/places/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id:ObjectId(id)};
            const place = await placesCollection.deleteOne(query);
            res.send(place);
        })

        app.post('/places', async(req, res)=>{
            const newPlace = req.body;
            const result = await placesCollection.insertOne(newPlace);
            res.send(result);
        })

    }
    finally {

    }
}
run().catch(console.dir);




app.listen(port, () => {
    console.log('All the services should be here');
})