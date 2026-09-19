const express = require('express'),
    mongoose = require('mongoose'),
   ejs = require('ejs'),
   nodemailer = require('nodemailer'),
  app = express();
  app.use(express.static("public"));


app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }));
   
    
   //conecting node.js to mongodb
   mongoose.connect('mongodb://127.0.0.1:27017/onlineDB')
   try{
    console.log("Database Connected")
   }
   catch(e){
  console.error("Database not connected: ",e)
 }

 //WE CREATE OUR SCHEMA
 const studentSchema = new mongoose.Schema({
    firstname:String,
    lastname:String,
    sex:String,
    course:String,
    email:String
 })
  const Student = new mongoose.model("student", studentSchema);
     
  const transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:"ademol91daniel@gmail.com",
        pass: 'ivfu rarq hvbc magq'
        
    }
  })

app.get('/', (req, res) => {
    res.render('index')

})


   app.post('/', async(req, res)=> {
          const { firstname, lastname, sex,course, email } = req.body;
          try {
              const newStudent = new Student({ firstname, 
                                              lastname,
                                               sex,
                                             course,
                                              email 
                                        })
                               await newStudent.save();
                               res.send("Data Succesfully Saved")
   }
   catch(e){
    res.send('Could not save data to db')
    console.log('Failed to save data: ${e}')
   }
    let msg = " Dear "+ firstname + " " + lastname +
    ", your registration based on your selected course," +
     course + ", please find the flyer attached";

    const mailoptions = {
        from: "ademol91daniel@gmail.com",
        to:email,
        subject:'The code center',
        text: msg,
        attachments:[
            {
             filename:course + '.png',
             path:__dirname  +'/' + course + '.png',
             cid: course+'.png'
            }
        ]
    }

    transporter.sendMail(mailoptions,(error, info)=>{
    if (error) {
        console.log(error);

    }else{
        console.log('Email sent:' + info.response);
    }
    })

   })
   app.listen(3000, ()=> console.log("server started on port 3000"));
   
  

