const express = require('express');
const bodyParser = require('body-parser');
const AWS = require('aws-sdk');
const multer = require('multer');
const upload = multer();

const app = express();
const port = process.env.PORT || 3000;

// Configure AWS
AWS.config.update({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const dynamoDB = new AWS.DynamoDB.DocumentClient();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.post('/api/join-waitlist', upload.none(), async (req, res) => {
    const { userType, name, email, pocPhone } = req.body;

    const tableName = userType === 'clubgoer' ? 'WavvClubgoersWaitlist' : 'WavvClubsWaitlist';

    const item = {
        id: `${userType}_${Date.now()}`,
        name,
        email,
        createdAt: new Date().toISOString()
    };

    if (userType === 'club') {
        item.pocPhone = pocPhone;
    }

    const params = {
        TableName: tableName,
        Item: item
    };

    try {
        await dynamoDB.put(params).promise();
        res.json({ success: true, message: 'Successfully joined the waitlist!' });
    } catch (error) {
        console.error('Error adding item to DynamoDB:', error);
        res.status(500).json({ error: 'Failed to join waitlist' });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});