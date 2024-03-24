const express = require("express")
const multer = require('multer')
const app = express()
const fs = require("fs")
const cors = require('cors');
const mongoose = require('mongoose');
const axios = require("axios").default;
app.use(cors());
require('dotenv').config();
const upload = multer({ dest: 'uploads/' });
app.use("/uploads", express.static(__dirname + "/uploads"));
app.use((req, res, next) => {
    res.setHeader("Content-Security-Policy", "default-src 'none'; img-src 'self' data:;");
    next();
});
// Connect to MongoDB using Mongoose
// mongoose.connect('mongodb://localhost:27017/your_database_name', { useNewUrlParser: true, useUnifiedTopology: true });
// const db = mongoose.connection;
// db.on('error', console.error.bind(console, 'MongoDB connection error:'));
// db.once('open', () => {
//     console.log('Connected to MongoDB');
// });

// // Define a Mongoose schema for produceObject
// const produceSchema = new mongoose.Schema({
//     name: String,
//     quantity: Number,
//     uploadDate: Date
// });

// // Create a Mongoose model based on the schema
// const Produce = mongoose.model('Produce', produceSchema);



app.get("/test", (request, response) => {
    console.log(response)
    response.send("blah blah")


})

app.get("/endpoint", (request, response) => {
    response.send("hello amma!")

})

app.post('/uploads', upload.single('photo'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    const currentDate = new Date();
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    const seconds = currentDate.getSeconds();
    // Here, req.file contains the uploaded file information
    console.log('File uploaded:', req.file);
    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    const path = `uploads/uploaded_file_${formattedTime}.jpg`;
    fs.rename(req.file.path, path, (err) => {
        if (err) {
            console.error(err);
        }
        console.log('File uploaded successfully.');
        console.log("http://localhost:3001/" + path);

        var path_to_local_file = "./" + path;
        var image_data = fs.readFileSync(path_to_local_file);
        var image_extension = path_to_local_file.split('.').pop();
        console.log(image_extension)
        //For now, let's make sure to prepend appropriately with: "data:image/extension_here;base64" 
        var astica_input = `data:image/${image_extension};base64,${image_data.toString('base64')}`;


        const requestData = {
            tkn: process.env.AI_API, // Replace with your API token
            modelVersion: '2.0_full',
            input: astica_input,
            visionParams: 'gpt,describe,describe_all,tags,faces', // Use comma separated values
            gpt_prompt: '', // Only used if visionParams includes "gpt" or "gpt_detailed"
            prompt_length: 95 // Number of words in GPT response
        };

        axios.post('http://vision.astica.ai/describe', requestData)
            .then((response) => {
                console.log("SUCCESS!", response.data);
            })
            .catch((error) => {
                console.log("ERROR:", error);
            });

    });

    //Input Method 2: base64 encoded string of a local image (slower)  



});




app.listen(3001)