const User=require('../model/user.model');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');

const signupDetail = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ username, email, password: hashedPassword });
        const token = generateToken(newUser.id); // Generating a token after signup
        return res.status(201).json({ token });
    } catch (error) {
        console.error('Error creating user:', error); // Log the error for better debugging
        res.status(500).json({ error: 'Error creating user' });
    }
    
};



function generateToken(userId,username,ispremiumuser) {
    return jwt.sign({ id: userId,username,ispremiumuser }, 'yourSecretKey'); // Use a secure secret key
}


const loginDetail = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        const foundUser = await User.findOne({ where: { email } });
        if (!foundUser) {
            return res.status(400).json({ error: 'User not found' });
        }

        const isPasswordValid = await bcrypt.compare(password, foundUser.password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: 'Incorrect password' });
        }

        const token = generateToken(foundUser.id, foundUser.username, foundUser.ispremiumuser); // Make sure you have a function to generate the token
        return res.status(200).json({
            success: true,
            message: 'User logged in successfully',
            token: token,
        });
    } catch (error) {
        console.error('Error during login:', error); // More specific log message
        res.status(500).json({ error: 'Internal server error' });
    }
};


 


module.exports = {
    signupDetail,
    loginDetail,
    generateToken
}