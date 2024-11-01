const express = require('express');


const resetpasswordController = require('../controller/forgetpassword.controller');

const router = express.Router();

//const userauthentication = require('../middleware/auth.js');
const resetPassword = require('../controller/forgetpassword.controller');

router.post('/forgot-password', resetPassword.forgetPassword);

router.post('/update-password', resetpasswordController.updatePassword)


module.exports = router;