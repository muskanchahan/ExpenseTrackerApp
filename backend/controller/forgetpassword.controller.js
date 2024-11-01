const User=require('../model/user.model')
 const bcrypt=require('bcrypt')


  const forgetPassword= async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.json({ success: false, message: 'Email not found' });
        }
        return res.json({ success: true, message: 'Email verified' });
    } catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
};

// Update Password Route
const updatePassword = async (req, res) => {
    const { email, newPassword } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await User.update({ password: hashedPassword }, { where: { email } });
        return res.json({ success: true, message: 'Password updated successfully' });
    } catch (error) {
        console.error('Error updating password:', error); // Log the actual error
        return res.status(500).json({ message: 'Error updating password' });
    }
};



module.exports={
    forgetPassword,
    updatePassword
}