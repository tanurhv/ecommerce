const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const router = express.Router();
const uuid = require('uuid');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const port = 4000

app.use(bodyParser.json());
app.use(cors());

//MongoDb Connection
const MongoClient = require('mongodb').MongoClient;
const dbUrl = 'mongodb+srv://root:<password>@<cluster-name>.begfl2a.mongodb.net/';
const dbName = 'ecommerce';

const client = new MongoClient(dbUrl);

async function run() {
    try {
        await client.connect();
        console.log("MongoDB Connected successfully to server");
        const db = client.db(dbName);
        app.locals.db = db;
    } catch (err) {
        console.log(err.stack);
    }

    finally {
        //await client.close();
    }
}

run();

app.get('/', (req, res) => {
    res.json({ "msg": "Hello World!" })
})

//Version Checker API

app.get('/checkVersion/:version', (req, res) => {
    let appVersion = req.params.version;
    let currentVersion = 3;
    if (appVersion < currentVersion) {
        res.json({ "msg": "New version available. Please update!" })
    } else {
        res.json({ 'msg': 'No new version available' })
    }
})

app.listen(port, () => {
    console.log(`Ecommerce app listening at http://localhost:${port}`)
})
