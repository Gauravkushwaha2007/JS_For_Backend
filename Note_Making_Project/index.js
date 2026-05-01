const path = require('path');
const fs = require('fs');
const express = require('express');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.set('view engine', 'ejs');


app.get('/',((req, res)=>{
    fs.readdir('./files',((err,files)=>{
        console.log(files);
        res.render('index',{files: files});
    }))
}));

app.post('/creat',((req,res)=>{
    // console.log("title hai ", req.body.title);
    fs.writeFile(`./files/${req.body.title.split(' ').join("")}.txt`, req.body.detail,((error)=>{
        error? console.log(error) : console.log('File created')
    }))
    res.redirect('/');
}));

app.get('/files/:filename',((req, res)=>{
    fs.readFile(`./files/${req.params.filename}`, "utf-8", ((err, filedata)=>{
        res.render('content',{filename: req.params.filename, filedata});
    }));
}));

app.post('/delete/:filename',((req, res)=>{
    fs.unlink(`./files/${req.params.filename}`,(e)=>{
        e? console.log("Error Accured", e) : console.log('Sucessfully Delete');
        res.redirect('/');
    })
}));

app.get('/rename/:filename',((req, res)=>{
    const file = req.params.filename;
    res.render('rename', {filename: file});
}));

app.post('/rename/:filename', ((req, res)=>{
    if(!req.body.newname){res.send('Enter valid name');}
    fs.rename(`./files/${req.params.filename}`, `./files/${req.body.newname}`,((e)=>{
        e? console.log("Couldn't rename file") : console.log('File renamed');
        res.redirect('/');
    }))
}))




const Port = 3000;
app.listen(Port,(()=>{
    console.log(`Server running at place http://localhost:${Port}`);
}))