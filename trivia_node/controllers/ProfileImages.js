const AWS = require('aws-sdk');
require('dotenv').config();
const { v4: uuidv4 } = require('uuid');
const User = require('../models/User');

// Upload images to iDrive
exports.uploadProfileImage = async (req, res) => {
    const s3 = new AWS.S3({
        endpoint: new AWS.Endpoint(process.env.IDRIVE_E2_PUBLIC_ENDPOINT),
        accessKeyId: process.env.IDRIVE_E2_ACCESS_KEY,
        secretAccessKey: process.env.IDRIVE_E2_SECRET_KEY,
        region: 'London',
        s3ForcePathStyle: true,
    });

    try {

        const { id } = req.params;
        if (!req.file) {
            return res.status(400).json({ message: 'No file to upload ' });
        }

        // Generate unique filename name
        const filename = `${uuidv4()}-${req.file.originalname}`;

        // Searching user by ID
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const uploadResult = await s3.upload({
            Bucket: 'quizzard',
            Key: `profiles/${filename}`,
            Body: req.file.buffer,
            ContentType: req.file.mimetype,
            ACL: 'public-read',
        }).promise();

        // Store image link in the DB
        await user.update({
            profileImage: uploadResult.Location,
        });

        res.status(200).json({ message: 'Image uploaded successfully' });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Can't upload image", error: error.message });
    }
}

// Getting profile image
exports.getProfileImage = async (req, res) => {

    try {
        const { id } = req.params;

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if user has profile image
        if (!user.profileImage) {
            return res.status(404).json({ message: 'Profile image not found' });
        }

        res.status(200).json({ imageUrl: user.profileImage });
    } catch (error) {
        res.status(500).json({ message: "Can't retrieve profile image", error: error.message });
    }
}