const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient , ObjectId } = require('mongodb');

const app = express();
const port = 5000;
const url = 'mongodb://localhost:27017';
const dbName = 'compa';
const collectionName = 'emp';

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

MongoClient.connect(url , {})
 .then(client =>{
    console.log('Connected to Monogdb');
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    app.get('/',async(req,res)=>{
        const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>emp database</title>
        </head>
        <body>
            <h1>WELCOME TO EMP DATABASE</h1><br>
            <ul>
               <li><a href="/insert">1. Insert Employee</a></li>
               <li><a href="/display">2,Dsiplay Employee</a></li>
               <li><a href="/delete">3.Delete Employee</a></li>
               <li><a href="/update">4.Update Employee</a></li>
            </ul>
            
        </body>
        </html>
        `
        res.send(html);
    });

    app.get('/insert',async(req,res)=>{
        const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Insertion</title>
        </head>
        <body>
            <h1>Insert emp info</h1>
            <form action="/insert" method="POST">
            <label for="empid">Enter emp ID : </label>
            <input type="text" id="empid" name="empid" required><br>
            <label for="empname">Enter emp NAME : </label>
            <input type="text" id="empname" name="empname" required><br>
            <label for="empage">Enter emp AGE : </label>
            <input type="number" id="empage" name="empage" required><br>
            <button type="submit">ADD</button>
            </form>
            <a href = '/'>Get back to home page</a>
        </body>
        </html>
        `
        res.send(html);
    });

    app.post('/insert',async(req,res)=>{
        try{
            const {empid , empname , empage } = req.body;

            await collection.insertOne(
                {
                    empid,
                    empname,
                    empage : parseInt(empage)

                }
            );
            res.redirect('/');
        }
        catch(error)
        {
            console.log("EROOR");
        }
    });

    app.get('/display',async(req,res)=>{

        const allemp = await collection.find({empage : { $gt : 0 }}).toArray();
        const html = `
        <!DOCTYPE html>
        <html>
        <body>
        <h1>ALL EMPLOYEES : </h1>
         ${allemp.map(a1 => `<li>${a1.empid} ${a1.empname} ${a1.empage}</li>`).join('')}
        </body>
        </html>
        `
        res.send(html);
    });

    app.get('/delete',async(req,res)=>{
        const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Deletion</title>
        </head>
        <body>
            <h1>Emp Deletion</h1>
            <form action = "/delete" method="POST">
                <label for="empid">Enter Employee ID </label>
                <input type="text" id="empid" name="empid" required><br>
                <button type="submit">DELETE</button>
            </form>
            <a href="/">Get back to home page</a>
        </body>
        </html>
        `
        res.send(html);
    });

    app.post('/delete',async(req,res)=>{
        try{
            const { empid } = req.body;
            await collection.deleteOne({empid});
            res.redirect('/')
        }
        catch(error)
        {
            console.log(error);
        }
    })
    app.get('/update', async (req, res) => {
        const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Update Employee</title>
        </head>
        <body>
            <h1>Update Employee Age</h1>
            <form action="/update" method="POST">
                <label for="empid">Enter Employee ID: </label>
                <input type="text" id="empid" name="empid" required><br>
                <label for="empage">Enter New Age: </label>
                <input type="number" id="empage" name="empage" required><br>
                <button type="submit">UPDATE</button>
            </form>
            <a href="/">Get back to home page</a>
        </body>
        </html>
        `;
        res.send(html);
    });
    
    // Route to handle the update
    app.post('/update', async (req, res) => {
        try {
            const { empid, empage } = req.body;
            const result = await collection.updateOne(
                { empid },
                { $set: { empage: parseInt(empage) } }
            );
            res.redirect('/');
        } catch (error) {
            console.log(error);
            res.status(500).send("Internal Server Error");
        }
    });
    
    app.listen(port, () => {
        console.log('Running on port 5000');
    });

    

 }
 )

 .catch(error=>{
    console.log("Error connecting to mongodb");
 });