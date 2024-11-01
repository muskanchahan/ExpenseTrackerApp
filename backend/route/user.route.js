const express=require('express');
const router=express.Router();
const authMiddleware=require('../middleware/auth')
const userController=require('../controller/user.controller')


router.post('/signup', userController.signupDetail);
router.post('/login', userController.loginDetail);


module.exports=router;