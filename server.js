const express = require("express");
const mongoose = require("mongoose");
const ShortUrl =require("./models/shortUrl");
const bodyParser = require("body-parser");
const shortid = require("shortid");

const app = express();

mongoose.connect("mongodb://localhost:27017/urlShortner",{useNewUrlParser:true, useUnifiedTopology:true});

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");

app.get("/",async(req,res)=>{
   const shorturl= await ShortUrl.find()
    res.render("index",{shorturl:shorturl});
});

app.post("/shortUrl",async(req,res)=>{
    await ShortUrl.create({full: req.body.fullurl})
    res.redirect("/");
})

app.get('/:shortUrl', async (req, res) => {
    const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl })
    if (shortUrl == null) return res.sendStatus(404)
  
    shortUrl.clicks++
    shortUrl.save()
  
    res.redirect(shortUrl.full)
  })

app.listen(3000,()=>{
    console.log("listening at port 3000");
})