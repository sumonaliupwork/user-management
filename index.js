const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// user: 
// pass: 

// send data to server

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yh0cs.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const database = client.db("management");
        const usersCollection = database.collection("users");

        // GET API
        app.get('/users', async (req, res) => {
            const query = usersCollection.find({});
            const result = await query.toArray();
            res.send(result);
        });
        app.get('/users/:id', async (req, res) => {
            const id = req.params.id;
            const user = { _id: ObjectId(id) };
            const result = await usersCollection.findOne(user);
            res.send(result);
        })
        // POST API
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.json(result);
        });
        // UPDATE API
        app.put('/users/:id', async (req, res) => {
            const id = req.params.id;
            const updateUser = req.body;
            const filter = { _id: ObjectId(id) };
            const updateDoc = {
                $set: {
                    name: updateUser.name,
                    email: updateUser.email
                },
            };
            const result = await usersCollection.updateOne(filter, updateDoc);
            res.json(result);
        })
        // DELETE API
        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const user = { _id: ObjectId(id) };
            const result = await usersCollection.deleteOne(user);
            res.send(result);
        })

    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Hello updated');
});
app.get('/hello', (req, res) => {
    res.send('Hi, Md. Ahsan Ullah');
})

app.listen(port, () => {
    console.log('Hitting the port', port);
});