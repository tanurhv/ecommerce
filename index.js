const express = require('express');
const app = express();
const path = require('path');
const port = 4000

app.get('/', (req, res) => {
    res.json({ "msg": "Hello World!" })
})

app.listen(port, () => {
    console.log(`Ecommerce app listening at http://localhost:${port}`)
})
