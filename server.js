const express = require('express')
const app = express()
const port = process.env.PORT || 5000;
const mongoose = require('mongoose')
const URI = 'mongodb+srv://shinexcx:Xcx208107622@tinyurl.rd4le.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
const shortId = require('shortid')
const path = require("path");
const { url } = require('inspector');


mongoose
  .connect(URI)
  .then(() => {
    console.log("Connected to MongoDB!");
  })
  .catch((err) => {
    console.log(err);
  });


const UrlSchema = new mongoose.Schema({
    long: { type: String, require: true },
    short: { type: String, require: true,
    default: shortId.generate  }
  });
const Url = mongoose.model("Url", UrlSchema);


app.set('view engine', 'ejs')
app.use(express.urlencoded({extended: false})); 

let longurl = "";
//let shorturl = "";

app.get("/", async(req, res) => {      //return index file
  try{
    const shortUrl = await Url.findOne({long: longurl})
    console.log(shortUrl.long)
    console.log(path.join(__dirname, 'public'))
   res.render('index',{shortUrl: shortUrl})
    //res.sendFile(path.join(__dirname,  "index.html"));
   //res.render('index')
  }catch(err){
    console.log(err);
  }
});


app.post('/shortUrl',async(req,res) => {        //shortUrl is the end point
  try {  
  
    await Url.create({long: req.body.long})
    longurl = req.body.long
    console.log("create a new shorturl")
    res.redirect('/')
  } catch(err){
    console.log(err);
  }
})

app.get('/:short', async (req,res) =>{   //req.params.short is the :short
    const result = await Url.findOne({short: req.params.short})

    if(result == null) return res.sendStatus(404)
    res.redirect(result.long)
})


app.listen(port, () => {
    console.log(`listening`);
  });