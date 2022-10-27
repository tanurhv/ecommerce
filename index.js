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

//User Register API

app.post('/register', (req, res) => {
    const db = app.locals.db;
    let name = req.body.name;
    let email = req.body.email;

    let newOTP = Math.floor(Math.random() * 9000) + 1000;

    const otpCollections = db.collection('otp');

    otpCollections.find({ 'email': email }).limit(1).sort({ _id: -1 }).toArray(function (err, result) {
        if (err) {
            console.log(err.message);
        } else if (result.length) {

            otpCollections.updateOne({ 'email': email }, { $set: { 'otp': newOTP } }, function (err, object) { });
            console.log("OTP updated successfully");
        } else {
            let data = { 'email': email, 'name': name, 'otp': newOTP };
            otpCollections.insertOne(data, function (err, result) {
                if (err) {
                    res.end("Registration failed");
                    console.warn(err.message);
                }
            });
        }
    })

    res.json({ 'email': email, 'name': name, 'register': true, 'msg': 'Register successful' });
})



app.listen(port, () => {
    console.log(`Ecommerce app listening at http://localhost:${port}`)
})
