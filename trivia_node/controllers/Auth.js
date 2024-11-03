const { generateToken } = require('../lib/token');
const User = require('../models/User');

const createToken = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user) {
            console.log('User not found:', email);
            return res.status(404).json({ message: 'User not found.' });
        } else {
            const isPasswordValid = await user.comparePassword(password);
            if (!isPasswordValid) {
                console.log('Invalid password');
                return res.status(401).json({ message: 'Invalid password.' });
            } else {
                const token = generateToken(user.id);
                res.status(200).json({ message: 'Token generated successfully.', token: token, userId: user.id });
            }
        }
    } catch (error) {
        res.status(500).json({ message: 'Error generating token:', error: error.message });
    }
}

const Auth = {
    createToken: createToken,
}

module.exports = Auth;