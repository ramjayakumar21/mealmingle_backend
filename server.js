const express = require("express")
const multer = require('multer')
const app = express()
const fs = require("fs")
const cors = require('cors');
app.use(cors());
const upload = multer({dest: 'uploads/'});


app.get("/test",(request, response) =>{
    console.log(response)
    response.send("blah blah")


} )

app.get("/endpoint",(request,response ) => {
    response.send("hello amma!")

})

app.post('/uploads', upload.single('photo'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    // Here, req.file contains the uploaded file information
    console.log('File uploaded:', req.file);

    fs.rename(req.file.path, 'uploaded_file.jpg', (err) => {
        if (err) {
            return res.status(500).send('Error saving file.');
        }
        res.status(200).send('File uploaded successfully.');
    });

});




app.listen(3000)