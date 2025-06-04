const express = require('express');
const { google } = require('googleapis');
const bodyParser = require('body-parser');
const cors = require('cors');
const credentials = require('./hotelplannerfaq-074806d52418.json');

const app = express();
const PORT = process.env.PORT || 5001; // ✅ FIXED

app.use(cors());
app.use(bodyParser.json());

const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ['https://www.googleapis.com/auth/spreadsheets']
});

const SHEET_ID = '11sKAASLIv6CMAKjZYItCGTRV7FP7U_xJzMWS-jkAd7M';

app.post('/log', async (req, res) => {
  const { question, answer } = req.body;

  try {
    const client = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: client });

    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: 'Sheet1!A:D',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[new Date().toLocaleString(), question, answer, 'Gemini']]
      }
    });

    res.status(200).send('Logged successfully.');
  } catch (err) {
    console.error('Error logging to Google Sheet:', err);
    res.status(500).send('Failed to log.');
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
