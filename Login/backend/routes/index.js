const express = require('express');
const router = express.Router();
const controller = require('../controller/user');
const  checkUser  = require('../config/validate_user')

/* GET home page. */
router.post('/', controller.addUser);
router.post('/login', controller.loginUser);
router.get('/all-user',checkUser,controller.getAllUSer)



module.exports = router;
