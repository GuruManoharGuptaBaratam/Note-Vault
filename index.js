const express = require('express')
const app = express()

const cors = require("cors");
app.use(cors());
const mongoose = require("mongoose")
const User = require("./models/user")
const Note = require("./models/Note")
app.use(express.json())
const port = 5003
mongoose.connect("mongodb+srv://NotePad:XUURdRf12FYRCROe@notebookcluster.rg21j.mongodb.net/",{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 50000 }
)
.then(() => console.log("MongoDB connected successfully! 🚀"))
.catch((err) => console.error("MongoDB connection error:", err));


app.get("/",(req,res)=>{
    res.sendFile("pages/name.html",{root:__dirname})
})
app.get("/home", (req, res) => {
    const {userToken} = req.body
    res.sendFile("pages/index.html",{root:__dirname})
});

app.get("/about",(req,res)=>{
    res.sendFile("pages/about.html",{root:__dirname})
})

app.get('/signup', (req, res) => {
    const {userToken} = req.body
    res.sendFile("pages/signup.html",{root: __dirname})
})


app.get('/login', (req, res) => {
    const {userToken} = req.body
    res.sendFile("pages/login.html",{root: __dirname})
})




app.post("/getnotes", async(req, res) => {
    let notes = await Note.find({email: req.body.email})
    res.status(200).json({success:true,notes})
});
app.post("/login", async (req, res) => {
    const {userToken} = req.body
    let user = await User.findOne(req.body)
    if (!user){
        res.status(200).json({success:false, message: "User not Found !"})
    }
    else{
        res.status(200).json({success:true, user: {email: user.email}, message: "User Found 👍"})
    }
    
});
app.post("/signup", async (req, res) => {
    const {userToken} = req.body
    console.log(req.body)
    let user = await User.create(req.body)
    res.status(201).json({success:true, user: user})
})

app.post("/addnote", async (req, res) => {
    console.log("New Note is created:", req.body);  // ✅ Debugging log
    try {
        let note = await Note.create(req.body);
        res.status(200).json({ success: true, note });
    } catch (error) {
        console.error("Error creating note:", error);  // ✅ Log errors
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});

app.post("/delete", async (req, res) => {
    try {
        const { noteId } = req.body; // Extract note ID from request

        if (!noteId) {
            return res.status(400).json({ success: false, message: "Note ID is required" });
        }

        const deletedNote = await Note.findByIdAndDelete(noteId);

        if (!deletedNote) {
            return res.status(404).json({ success: false, message: "Note not found" });
        }

        res.status(200).json({ success: true, message: "Note deleted successfully" });
    } catch (error) {
        console.error("Error deleting note:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});





app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})