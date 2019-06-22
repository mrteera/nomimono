const express = require('express');
const request = require('request-promise-native');
const uuid = require('uuid/v1');

const { apiKey, apiSecret, billerId } = require('../config');

const router = express.Router();


router.post('payment', async (req, res) => {
  const tokenResponse = request('https://api.partners.scb/partners/sandbox/v1/oauth/token', {
    headers: {
      'Accept-Language': 'EN',
      'Content-Type': 'application/json',
      'requestUId': uuid(),
      'resourceOwnerId': apiKey,
    },
    method: 'POST',
    body: {
      applicationKey: apiKey,
      applicationSecret: apiSecret,
    },
    json: true
  });

  if (tokenResponse.status.code != 1000) {
    return res.status(500).send({ error: 'Cannot get access token', response: tokenResponse });
  }

  const paymentResponse = request('https://api.partners.scb/partners/v2/deeplink/transactions', {
    headers: {
      'Accept-Language': 'EN',
      'Authorization': `Bearer ${tokenResponse.data.accessToken}`,
      'Content-Type': 'application/json',
      'requestUId': uuid(),
      'resourceOwnerId': apiKey
    },
    body: {
      paymentAmount: 100.00,
      transactionType: 'PAYMENT',
      transactionSubType: 'BPA',
      ref1: '2003002913251522',
      ref2: '2003002913251522',
      accountTo: billerId
    },
    json: true
  });

});
