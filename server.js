const express=require('express');
const Case = require('./models/case');
const { request } = require('http');
const mongoose=require('mongoose')
const path=require('path')
const port=3019

const app=express();
app.use(express.static(__dirname))
app.use(express.urlencoded({extended:true}))
app.use(express.static(__dirname));

mongoose.connect('mongodb://127.0.0.1:27017/login')
const db=mongoose.connection
db.once('open',()=>{
    console.log("Mongodb connection successful")
})

db.on('error', (err) => {
    console.log("MongoDB connection error:", err);
})
const userSchema= new mongoose.Schema({
    name:String,
    password:String
})


const Users=mongoose.model("data",userSchema)

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'Login.html'))
})




app.post('/post', async (req, res) => {
    const { name, password } = req.body;

    console.log(name, password);

    try {
        // SAVE TO DATABASE
        const user = new Users({ name, password });
        await user.save();

        // LOGIN CHECK
        if (
            (name === "admin" && password === "1234") ||
            (name === "shra" && password === "102")
        ) 
        {
            res.sendFile(path.join(__dirname, 'Dashboard.html'));
        } 
        
        else {
            res.send("   Invalid Username / Password  ");
        }

    } catch (err) {
        console.error(err);
        res.status(500).send("Database Error");
    }
});


// ================= CREATE CASE =================
app.post('/create-case', async (req, res) => {
    try {
        const newCase = new Case({
            caseId: req.body.caseId,
            caseTitle: req.body.caseTitle,
            incidentDateTime: req.body.incidentDateTime,
            location: req.body.location,
            officers: req.body.officers,
            firDescription: req.body.firDescription,
            suspects: req.body.suspects,
            crimeDescription: req.body.crimeDescription,
            witnesses: req.body.witnesses
        });

        await newCase.save();

        // ✅ Send alert + redirect
        res.send(`
            <script>
                alert("✅ Case saved successfully!");
                window.location.href = "/Dashboard.html";
            </script>
        `);

    } catch (err) {
        console.error(err);
        res.send(`
            <script>
                alert("❌ Error saving case");
                window.history.back();
            </script>
        `);
    }
});


app.listen(port,()=>{
    console.log("Server Started")
})