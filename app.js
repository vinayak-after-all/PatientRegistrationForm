const express=require("express");
const bodyParser=require("body-parser");
const ejs=require("ejs");
const mongoose=require("mongoose");
const passwordValidator = require('password-validator');
const validator=require("validator");

const app=express();
const port=process.env.PORT || 3000;

app.use(express.static("public"));
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));

const passwordSchema = new passwordValidator();
const addressSchema = new passwordValidator();
const emailSchema = new passwordValidator();
const phoneSchema = new passwordValidator();

passwordSchema
    .has().uppercase()
    .has().lowercase()
    .has().digits()
    .is().min(8)
    .is().max(15);

addressSchema
    .is().min(10);

emailSchema
    .usingPlugin(validator.isEmail);

phoneSchema
    .is().min(10)
    .usingPlugin(validator.isMobilePhone);


mongoose.connect("mongodb://127.0.0.1:27017/patientsDB")

const patientSchema = {
  name: String,
  address: String,
  email:String,
  phone:String,
  password:String
};

const Patient = mongoose.model("Patient", patientSchema);

/*console.log(schema.validate(req.body.password));*/

app.route("/register")
.get(function(req,res){
  res.render("register");
})

.post(function(req, res) {
  var a=passwordSchema.validate(req.body.password);
  var b=addressSchema.validate(req.body.address);
  var c=emailSchema.validate(req.body.email);
  var d=phoneSchema.validate(req.body.phone);

  if((a&b&c&d)==0)
  {
    res.render("error");
  }

  else
  {
    var newPatient = new Patient({
    name: req.body.name,
    address: req.body.address,
    email:req.body.email,
    phone:req.body.phone,
    password:req.body.password});


  newPatient.save(function(err) {
    if (!err) {
      res.send("Successfully added a new Patient");
    } else {
      res.send("Sorry, cant add new patients");
    }
    });
  }
});

app.listen(port,function(){
  console.log("PORT:3000 running");
});
