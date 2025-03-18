const mysql=require('mysql');
const express=require('express');
const app=express();
const path=require('path');
const multer=require('multer');
const fs=require('fs');
const crypto=require('crypto');
const port=8000;

const con=mysql.createConnection({
   host:'localhost',
   user:'root',
   password:'1234',
   database:'university'
});

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, 'public')));

const uploadDir=path.join(__dirname, "upload");
if(!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

const storage=multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,'upload/');
    },
    filename: function(req,file,cb){
        cb(null,crypto.randomBytes(8).toString("hex") + path.extname(file.originalname));
    }
});

upload=multer({storage:storage});

app.post("/student",upload.single('image'),(req,res)=>{
    const {id,name}=req.body;
    const imagePath=req.file?`${req.file.filename}`:null;
    const sql="INSERT INTO student(id,name,image) VALUES (?,?,?)";
    con.query(sql,[id,name,imagePath],(err,result)=>{
        if(err) throw err;
        res.send();
        res.end();
    });
});

app.use('/upload', express.static('upload'));

app.get("/",(req,res)=>{
   res.sendFile(path.join(__dirname,"public","/index.html"));
});

app.get("/",(req,res)=>{
    res.sendFile(path.join(__dirname,"public","/record.html"));
 });

 app.get("/",(req,res)=>{
    res.sendFile(path.join(__dirname,"public","/camara.html"));
 });

 app.post("/delete", (req, res) => {
    const { id } = req.body;
    const sql = "DELETE FROM student WHERE id=?";
    con.query(sql, [id], (err, result) => {
        if (err) throw err;
        res.json({ success: true });
    });
});

app.post("/show", (req, res) => {
    const sql = "SELECT * FROM student";
    con.query(sql, (err, result) => {
        if (err) throw err;
        res.json(result);
    });
});


app.listen(port,()=>{
    console.log(`server is running at http://localhost:${port}`);
});