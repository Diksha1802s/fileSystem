const express = require("express");
const fs = require("fs");
const app = express();
const port = 3001;
const path=require('path')

app.use(express.json());

app.post("/checkFile", (req, res) => {
  console.log("file",req.body)
    const fileName = req.body.fileName;
    const description = req.body.description;

    if (!fileName || !description) {
        return res.status(400).send("fileName and description are required");
    }

    if (fs.existsSync(fileName)) {
        console.log("File exists, adding data...");
        fs.appendFile(fileName, `\n${description}`, (err) => {
            if (err) {
                console.error("Error appending data:", err);
                return res.status(500).send("Error appending data");
            }
            res.send("Data added to existing file");
        });
    } else {
        console.log("File does not exist, creating file...");
        fs.writeFile(fileName, description, (err) => {
            if (err) {
                console.error("Error creating file:", err);
                return res.status(500).send("Error creating file");
            }
            res.send("File created and data written");
        });
    }
});
app.get("/content",(req,res)=>{
  fs.readFile('test.txt',(err,data)=>{
    if(err){
      console.log("error",err)
      return
    }
     res.send(data);
  })
})

app.post("/deleteFile", (req, res) => {
    const fileName = req.body.fileName;

    if (!fileName) {
        return res.status(400).send("fileName is required");
    }

    // Check if file exists
    if (fs.existsSync(fileName)) {
        fs.unlink(fileName, (err) => {
            if (err) {
                console.error("Error deleting file:", err);
                return res.status(500).send("Error deleting file");
            }
            console.log("File detected and deleted");
            res.send("File deleted successfully");
        });
    } else {
        console.log("File does not exist");
        res.status(404).send("File not found");
    }
});
app.get("/listing",(req,res)=>{
    try {
    const directoryPath = "C:/Users/Hp/OneDrive/Desktop/API setups/fileSystem";
    const files=fs.readdirSync(directoryPath)
    const txtFiles = files.filter(file => path.extname(file).toLowerCase() === ".txt");
    console.log("files",txtFiles)
    res.send(txtFiles)
    } catch (error) {
        console.log("error",error)    
    }
})
app.post("/updateFile", (req, res) => {
    const fileName = req.body.fileName;
    const description = req.body.description;
    const directoryPath = "C:/Users/Hp/OneDrive/Desktop/API setups/fileSystem";

    if (!fileName || !description) {
        return res.status(400).send("fileName and description are required");
    }

    const filePath = path.join(directoryPath, fileName);

    // Check if it's a .txt file
    if (path.extname(fileName).toLowerCase() !== ".txt") {
        return res.status(400).send("Only .txt files can be updated");
    }

    // Check if file exists
    if (!fs.existsSync(filePath)) {
        return res.status(404).send("File not found");
    }

    // Overwrite the file with new content
    fs.writeFile(filePath, description, (err) => {
        if (err) {
            console.error("Error writing file:", err);
            return res.status(500).send("Error updating file");
        }
        console.log(`File ${fileName} updated successfully`);
        res.send("File updated successfully");
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
