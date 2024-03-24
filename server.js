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

mongoose.connect(`mongodb+srv://kannanjayakumar101:${process.env.MONGODB_PASS}@cluster0.v58c7cb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Define a Mongoose schema for produceObject
const produceSchema = new mongoose.Schema({
    name: String,
    quantity: Number,
    quality: String,
    url: String
});

// Create a Mongoose model based on the schema
const Produce = mongoose.model('Produce', produceSchema);



app.get("/test", (request, response) => {
    console.log(response)
    response.send("blah blah")


})

app.get("/foods", async (request, response) => {
    try {
        // Query MongoDB to find all produce objects
        const produceList = await Produce.find({});
        response.json(produceList); // Send the list of produce objects as JSON
    } catch (error) {
        console.error("Error fetching produce objects:", error);
        response.status(500).send("Internal Server Error");
    }
});

app.post('/uploads', upload.single('photo'), async (req, res) => {
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

    try {
        const result = await fs.renameSync(req.file.path, path);
        console.log('File uploaded successfully.');
        console.log("http://localhost:3001/" + path);

        let path_to_local_file = "./" + path;
        let image_data = fs.readFileSync(path_to_local_file);
        let image_extension = path_to_local_file.split('.').pop();
        //For now, let's make sure to prepend appropriately with: "data:image/extension_here;base64" 
        let astica_input = `data:image/${image_extension};base64,${image_data.toString('base64')}`;


        const requestData = {
            tkn: '60019EFF-E674-4ECF-98B9-E4BF2A4CA5B36381265D75DFB5-CC47-4740-865F-EC278449A9F3',  // visit https://astica.ai
            modelVersion: '2.1_full', // 1.0_full, 2.0_full, or 2.1_full
            input: astica_input,
            visionParams: 'gpt, describe, describe_all, tags, faces', // comma separated, defaults to all
            gpt_prompt: 'find food in image and return list in format {food: [Food Name, Food Quantity, Food Ripeness]}. Return as JSON object, no backticks', // only used if visionParams includes "gpt" or "gpt_detailed"
            prompt_length: 95 // number of words in GPT response
          };
          
          
        let gpt_result = await axios({
              method: 'post',
              url: 'https://vision.astica.ai/describe',
              data: requestData,
              headers: {
                  'Content-Type': 'application/json',
              },
          })
        console.log(gpt_result.data);
        let data = gpt_result.data;

        try {

            // Save each item in the data object to MongoDB
            for (const foodItem of data.food) {
                const food = new Produce({
                    name: foodItem["Food Name"],
                    quantity: foodItem["Food Quantity"],
                    quality: foodItem["Food Quality"],
                    url: "http://localhost:3001/" + path
                });
                await food.save();
            }
    
            console.log("Data saved to MongoDB");
    
            // Respond with data
            res.send(data);
        } catch (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
        } 


    } catch (err) {
        console.error(err);
    }
    
    




});




app.listen(3001)