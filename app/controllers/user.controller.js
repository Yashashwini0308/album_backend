
const db = require('../models')
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const utils = require('../utils/Utils.js') 

const User = db.users;
const Op = db.Sequelize.Op;

exports.signup = async (req, res) => {
  const user = await User.findOne({ where : {email : req.body.email }});
  if(user){
    res.status(409).json({message:"User Already Exist"})
  }
  const salt = await bcrypt.genSalt(10);
  var usr = {
    firstName : req.body.firstName,
    lastName: req.body.lastName,
    phoneNo: req.body.phoneNo,
    email : req.body.email,
    password : await bcrypt.hash(req.body.password, salt)
  };

  const created_user = await User.create(usr);
  console.log(created_user)
  res.status(201).json(created_user);
};

exports.login = async (req,res) =>{
    const user = await User.findOne({ where : {email : req.body.email }});
    if(user){
       const password_valid = await bcrypt.compare(req.body.password,user.password);
       if(password_valid){
           token = jwt.sign({ "id" : user.id,"email" : user.email,"name":user.firstName },process.env.SECRET);
           res.status(200).json({ token : token, userId: user.id, userName:user.firstName });
       } else {
         res.status(400).json({ error : "Password Incorrect" });
       }
     }else{
       res.status(404).json({ error : "User does not exist" });
     }
}

exports.getUserDetails= async (req,res)=>{
  const userId = req.params.id
  const user = await User.findOne(
    {
      where:{
        id: userId
      },
      attributes: {exclude: ['password']},
    }
  )
  res.status(200).json(user)
}


exports.updateUserDetails = async (req,res)=>{
  const userDetails = req.body.user;
  User.update({firstName:userDetails.firstName,lastName:userDetails.lastName,phoneNo:userDetails.phoneNo},{ where: { id: userDetails.id } }).then(response=>{
    res.status(200).json({ "message": "Update Success" })
  },err=>{
    console.log(err)
    res.status(400).json({"error":"something Went Wrong"})
  })
}
