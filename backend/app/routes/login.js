const express = require('express');
const request = require('request-promise-native');
const uuid = require('uuid/v1');

const { apiKey, apiSecret } = require('../config');

const userRepository = require('../repository/user-repository');

const router = express.Router();

/**
 * @typedef {Object} UserLogin
 * @property {string} scbAuthCode
 * @property {string} lineUserId
 * @property {string} phoneNumber
 * @property {string} accountNumber
 */

/** @type {UserLogin[]} */
const users = [];

router.get('/', async (req, res) => {
  try {
    const response = await request('https://api.partners.scb/partners/sandbox/v2/oauth/authorize', {
      headers: {
        'apikey': apiKey,
        'apisecret': apiSecret,
        'endState': 'mobile_app',
        'requestUId': uuid(),
        'resourceOwnerId': apiKey,
        'response-channel': 'mobile'
      },
      json: true
    });
    if (response.status.code != 1000) {
      return res.status(500).json({ message: 'Error', response });
    }
    const callbackUrl = response.data.callbackUrl;
    res.send(`<!DOCTYPE html><html><body><div style="text-align: center;"><p style="font-size: 4em;">กรุณาปิดหน้านี้</p></div><script>location.href="${callbackUrl}";</script></body></html>`);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Cannot connect to SCB login API' });
  }
});

router.get('/callback', (req, res) => {
  // Callback from SCB.

  // const { code } = req.query;
  const code = 'dbf9bc42-5421-43da-9cf1-e4a90a428a02';
  Promise.resolve().then(async () => {
    // const response1 = await request('https://api.partners.scb/partners/sandbox/v1/oauth/token', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'accept-language': 'EN',
    //     'requestUId': uuid(),
    //     'resourceOwnerId': apiKey
    //   },
    //   body: {
    //     'applicationKey': apiKey,
    //     'applicationSecret': apiSecret,
    //     'authCode': code
    //   },
    //   json: true
    // });

    // const accessToken = response1.data.accessToken;
    const accessToken = 'e7d0e670-de65-4627-bd66-7cde67c8df21';

    const response2 = await request('https://api.partners.scb/partners/sandbox/v1/customers/profile', {
      headers: {
        'accept-language': 'EN',
        'authorization': `Bearer ${accessToken}`,
        'requestUId': uuid(),
        'resourceOwnerId': code
      },
      json: true
    });

    const { profile } = response2.data;
    let mobile = profile.mobile.replace(/\(|\)|\-/g, '');

    const user = userRepository.findOneByPhoneNumber(mobile);
    if (!user) {
      res.status(500).send('<!DOCTYPE html><html><body><div style="text-align: center;"><p>เบอร์โทรศัพท์ไม่ถูกต้อง</p></div><script>setTimeout(() => location.href="line://", 3000);</script></body></html>');
    } else {
      user.scbAuthToken = code;
      user.customerProfile = profie;
      userRepository.save(user);
      res.send('<!DOCTYPE html><html><body><div style="text-align: center;"><p style="font-size: 4em;">เสร็จสิ้น</p></div><script>location.href="line://";</script></body></html>');
    }
  });
});

router.post('/callback2', (req, res) => {
  // Callback from DialogFlow.

  const body = req.body;
  const { originalDetectIntentRequest, queryResult } = body
  const { action, queryText } = queryResult;
  const lineUserId = originalDetectIntentRequest.payload.data.source.userId;

  let user = userRepository.findOneByLineId(lineUserId);
  if (!user) {
    user = userRepository.insert({ lineId: lineUserId });
  }

  switch (action) {
    case 'Registration.Registration.scb-account-id':
      user.scbAccountNumber = queryText;
      userRepository.save(user);
      break;

    case 'Registration.Registration.scb-account-id.Registration-phone':
      user.phoneNumber = queryText;
      userRepository.save(user);
      break;

    default:
      break;

    res.status(200).send();
  }

  // if (userIndex < 0) {
  //   user = { lineUserId }
  //   users.push(user);
  //   userId = users.length - 1;
  // } else {
  //   user = users[userIndex];
  // }

  // if (action == 'Registration.Registration.scb-account-id') {
  //   user.accountNumber = queryText;
  // } else if (action == 'Registration.Registration.scb-account-id.Registration-phone') {
  //   user.phoneNumber = queryText;
  // } else {
  //   return res.status(200).send();
  // }

  // users[userId] = user;
  // res.status(200).send();
});

module.exports = router;
