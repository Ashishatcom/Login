const {User} = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Op } = require("sequelize");
const addUser = async (req,res)=>{
    var data = {
     firstName : req.body.name,
     lastName : req.body.lname,
     email : req.body.email,
     password : req.body.passwords,
     phone : req.body.Phone,
    }

     let userFind  = await User.findOne({
         where:{
            [Op.or]:[{email: data.email},{phone: data.phone}],
         }
     })  
       if(!userFind){
        let passwords = await bcrypt.hash(data.password, bcrypt.genSaltSync(10));
             data.password = passwords;
          let saveuser = await User.create(data);
            res.json({Message:saveuser})
        }else{
            if(userFind.email == data.email){
            res.json({Status:401,Message:"EMAIL_ALREDY_EXIST"})
            }else{
                res.json({Status:401,Message:"PHONE_ALREDY_EXIST"}) 
            }
        }
}

const loginUser = async (req,res)=>{
    //   console.log(req.body);
    let findUser =  await User.findOne({
        where:{
            email:req.body.email
        }
    })
  

    if(findUser){
        let isPasswordMatch = await bcrypt.compare( req.body.password, findUser.password);
        if(isPasswordMatch==true){
            let token = jwt.sign({
                email:findUser.email,
                userId:findUser.id
                 },"Demo_Register",{
                expiresIn:'1h'
              })
              res.json({token:token})
            //  return "PASSWORD_MATCH"
        }else{
           res.json( {Status:401,Message:"EITHER_EMAIL_OR_PASSWORD_NOT_MATCH"});
        }

    }else{
        
        res.json( {Status:401,Message:"USER_NOT_FOUND"});
    }
}

const getAllUSer =  async (req,res)=>{
    let allUser =  await User.findOne({
        where:{
            id:req.UserData.userId
        }
    });
    res.json({Message:allUser})
}
module.exports = {
	addUser,
    loginUser,
    getAllUSer
}