const twilio = require('twilio');
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const VERIFY_SID = process.env.TWILIO_VERIFY_SERVICE_SID;

exports.sendOtp = (phone) =>
  client.verify.v2.services(VERIFY_SID)
    .verifications.create
    ({
      to: phone,
      channel: 'sms'
    });

exports.checkOtp = (phone, code) =>
  client.verify.v2.services(VERIFY_SID).verificationChecks.create({ to: phone, code });

exports.sendSms = (to, body) =>
  client.messages
    .create({
      from: process.env.TWILIO_PHONE_NUMBER,
      to,
      body
    });
