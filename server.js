const express=require('express');
const cors=require('cors')
const mongo=require('mongodb')
const bcrypt=require('bcryptjs')
const mongoclient=mongo.MongoClient
const app=express()
app.use(express.json())
app.use(cors({
  orgin:"*"
}))

const url="mongodb+srv://sahaja:sahaja12@cluster0.8s2tb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
app.post('/user-register',async function(req,res){
  try{
    let conn=await mongoclient.connect(url)
    let db=conn.db("userdb");
    let salt=await bcrypt.genSalt(10)
    let hash=await bcrypt.hash(req.body.password,salt)
    req.body.password=hash
    await db.collection("user").insertOne(req.body)
    await conn.close()
    res.json({
      message:"Registration successful"
    })
  }
  catch(err)
  {
    res.status(404).json({
      message:"error"
    })
  }
})

app.post('/user-login',async function(req,res){
  let conn=await mongoclient.connect(url);
  let db=conn.db("userdb")
  let user=await db.collection("user").findOne({email:req.body.email})
  if(user==null){
    res.status(401).json({
      msg:"User not found"
    })
  }
  else{
    let r=await bcrypt.compare(req.body.password,user.password)
    if(r)
    {
      res.json({
        message:"Logged in successfully"
      })
    }
    else{
      res.status(401).json({
        message:"Invalid password"
      })
    }
  }
})

var port=process.env.PORT||3000
app.listen(port,function(){
  console.log(`server running at port ${port}`)
})