const express = require('express');
const cors = require('cors');
const path = require('path');
const axios = require('axios');

const port = 3000;
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.post('/api', function(req, res) {
    const config = {
        headers: {
            'Content-Type': 'text/plain',
            'api_key': 'X2Mthk4Rd6NaN7b7tPyU127U5eaMqSYQ',
            'speed': '-3',
            'format': 'mp3'
        }
    }
    console.log(req.body.data);
    axios.post('https://api.fpt.ai/hmi/tts/v5', req.body.data, config)
        .then(response => res.json(response.data))
        .catch(err => res.status(400).json(err));
})

app.use(express.static(path.join(__dirname, 'client')));
app.get('*', (req,res) =>{
    res.sendFile(path.join(__dirname, 'client/index.html'));
});

app.listen(port, function () {
    console.log("Server is running on http://localhost:"+ port +" port");
});