const { google } = require('googleapis');
const { OAuth2 } = google.auth;

const oAuth2Client = new OAuth2(
  '188678622456-a1vfo4e9ejkinbdemg904o91105qvjrn.apps.googleusercontent.com',
  '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',
  'https://adc5-2401-4900-4ffc-dcaa-61cc-5ae4-2d6c-502f.in.ngrok.io/google-auth'
);

const authorizeUrl = oAuth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: ['https://www.googleapis.com/auth/gmail.readonly'],
});

console.log('Authorize this app by visiting this url:', authorizeUrl);

oAuth2Client.getToken('YOUR_AUTHORIZATION_CODE', (err, token) => {
  if (err) {
    console.error('Error getting token:', err);
    return;
  }
  console.log('REFRESH_TOKEN:', token.refresh_token);
});
