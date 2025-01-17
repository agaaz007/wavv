const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand } = require('@aws-sdk/lib-dynamodb');

const app = express();
const port = 3000;

// Configure AWS DynamoDB
const client = new DynamoDBClient({ region: 'eu-north-1' });
const dynamoDB = DynamoDBDocumentClient.from(client);

// Enable CORS middleware
app.use(cors());

// Enable Body Parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Home route
app.get('/', (req, res) => {
    res.send('Welcome to the Wavv Waitlist API');
});

// Endpoint to handle Club-goer form
app.post('https://ojlt794cl3.execute-api.eu-north-1.amazonaws.com/dev/api/clubgoer', async (req, res) => {
    const { fullName, email } = req.body;
    const id = uuidv4();

    const params = {
        TableName: 'Waitlist',
        Item: {
            id,
            fullName,
            email,
            type: 'Club-goer',
        },
    };

    try {
        await dynamoDB.send(new PutCommand(params));
        res.status(200).send('Club-goer data saved successfully!');
    } catch (error) {
        console.error('Error saving data to DynamoDB:', error);
        res.status(500).send('Error saving data.');
    }
});

// Endpoint to handle Club form
app.post('https://ojlt794cl3.execute-api.eu-north-1.amazonaws.com/dev/api/clubs', async (req, res) => {
    const { clubName, email, pocPhone } = req.body;
    const id = uuidv4();

    const params = {
        TableName: 'Waitlist',
        Item: {
            id,
            clubName,
            email,
            pocPhone,
            type: 'Club',
        },
    };

    try {
        await dynamoDB.send(new PutCommand(params));
        res.status(200).send('Club data saved successfully!');
    } catch (error) {
        console.error('Error saving data to DynamoDB:', error);
        res.status(500).send('Error saving data.');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
