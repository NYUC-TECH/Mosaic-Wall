const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const http = require('http');
const path = require('path');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Middleware
app.use(bodyParser.json());

// MongoDB setup
mongoose.connect('mongodb+srv://admin2:admin2@cluster0.vgodb.mongodb.net/mosaic?', { useNewUrlParser: true, useUnifiedTopology: true });
const photoSchema = new mongoose.Schema({
    imageUrl: String,
    location: String,
    name: String,
    createdAt: { type: Date, default: Date.now }
});
const Photo = mongoose.model('Photo', photoSchema);

// Send index.html for the root route
app.use(express.urlencoded({extended : true}))
app.use('/static', express.static('public'))
app.set("view engine", "ejs")

// routes

app.use('/', require('./routes/index'))

// API to save photo data
app.post('/savePhoto', (req, res) => {
    const { imageUrl, location, name } = req.body;
    const utcDate = new Date(); // Current date in UTC

// Convert UTC to IST and save the adjusted time
const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30 in milliseconds
const adjustedDate = new Date(utcDate.getTime() + istOffset);
    const photo = new Photo({ imageUrl, location, name, createdAt : adjustedDate });
    photo.save().then(() => {
        res.status(200).send('Photo saved')
        console.log('dfghjk')
    });

});

app.post('/api/photos', async (req, res) => {
    try {

        const photos = await Photo.find({}); // Fetch all photos from the database
        console.log(photos, 'photos')
        res.json(photos);
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Error fetching photos', error });
    }
});

app.post('/revealLogo', (req, res) => {
    const {  location } = req.body;

    io.emit('revealLogo'+location);
    res.status(200).send('Logo reveal initiated');
});

app.post('/resetLogo', (req, res) => {

    const {  location } = req.body;
    console.log(location, 'data for dasboard')
    io.emit('resetLogo'+location);
    res.status(200).send('Logo reveal initiated');
});


// Handle socket communication
io.on('connection', (socket) => {
    console.log('New client connected');
    socket.on('newPhoto', (data) => {
    console.log(data, 'data from socket')
        io.emit('updateCanvas'+data.location, data);
    });
    socket.on('disconnect', () => console.log('Client disconnected'));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
