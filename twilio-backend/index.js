require('dotenv').config()
const express = require('express');
const { Twilio } = require('twilio');
const app = express();
const ngrok = require('ngrok');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_NUMBER;
const twilioIML_App_Sid = process.env.TWILIO_TWIML_APP_SID;
// const client = require('twilio')(accountSid, authToken);

const twilio = require('twilio');
const ClientCapability = twilio.jwt.ClientCapability;
const VoiceResponse = twilio.twiml.VoiceResponse;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Generate a Twilio Client capability token
app.get('/token', (request, response) => {

    const capability = new ClientCapability({
      accountSid: accountSid,
      authToken: authToken
    });
    
    capability.addScope(
        new ClientCapability.OutgoingClientScope({
          applicationSid: twilioIML_App_Sid
        })
    );

    const token = capability.toJwt();

    response.send({
        token: token,
    });
});


// Create TwiML for outbound calls
app.post('/voice', (request, response) => {
    const voiceResponse = new VoiceResponse();
    voiceResponse.dial({
      callerId: twilioNumber,
    }, request.body.number);
  
    response.type('text/xml');
    response.send(voiceResponse.toString());
});

// client.calls
//       .create({
//          twiml: '<Response><Say>Ahoy, World!</Say></Response>',
//          to: '+917778960989',
//          from: '+13342319307'
//        })
//       .then(call => console.log(call))
//       .catch(e => console.log({e}));

// const VoiceResponse = require('twilio').twiml.VoiceResponse;


// const response = new VoiceResponse();
// response.say('Hello World');
// console.log(response.toString());

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Listening on port ${port}...`));
// async function connectNgrok(){
//   let url = await ngrok.connect(3001);
//   console.log(url);
// }
// connectNgrok()