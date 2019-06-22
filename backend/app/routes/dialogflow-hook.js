const express = require('express');

const brrRepo = require('../repository/borrowing-request-repository');
const lrRepo = require('../repository/lending-request-respository');
const userRepo = require('../repository/user-repository');

const router = express.Router();

router.post('/cb', (req, res) => {
  // Callback from DialogFlow.

  const body = req.body;
  const { originalDetectIntentRequest, queryResult } = body
  const { action, queryText } = queryResult;
  const lineUserId = originalDetectIntentRequest.payload.data.source.userId;

  if (action.startsWith('Registration.Registration')) {
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

        return res.status(200).send();
    }

  } else if (action.startsWith('OfferLoan')) {
    const lastRequest = lrRepo.find({ lineUserId: lineUserId }).splice(-1)[0];
    if (action != 'OfferLoan.SelectMoney.money') {
      if (!lastRequest || (lastRequest.purpose && lastRequest.paymentMethod && lastRequest.period && lastRequest.amount)) {
        return req.status(400).send();
      }
    }

    switch (action) {
      case 'OfferLoan.SelectMoney.money':
        const request = lrRepo.insert({ amount: parseInt(queryText), lineUserId });
        break;

      case 'OfferLoan.SelectInterval.interval':
        lastRequest.period = parseInt(queryText);
        lrRepo.save(lastRequest);
        break;

      case 'OfferLoan.SelectMethod.method':
        lastRequest.paymentMethod = 'ผ่อน' ? 'installment' : 'whole';
        lrRepo.save(lastRequest);
        break;

      default:
        break;
    }
    return res.send();

  } else if (action.startsWith('RequestLoan')) {
    const lastRequest = brrRepo.find({ lineUserId: lineUserId }).splice(-1)[0];
    if (action != 'RequestLoan.SelectType.type') {
      if (!lastRequest || (lastRequest.purpose && lastRequest.paymentMethod && lastRequest.period && lastRequest.amount)) {
        return res.status(400).send();
      }
    }

    switch (action) {
      case 'RequestLoan.SelectType.type':
        const request = brrRepo.insert({ purpose: queryText, lineUserId });
        break;

      case 'RequestLoan.SelectMethod.method':
        lastRequest.paymentMethod = (queryText == 'เต็ม') ? 'whole' : 'installment'
        brrRepo.save(lastRequest);
        break;

      case 'RequestLoan.SelectInterval.interval':
        lastRequest.period = parseInt(queryText);
        brrRepo.save(lastRequest);
        break;

      case 'RequestLoan.SelectMoney.money':
        lastRequest.amount = parseInt(queryText);
        brrRepo.save(lastRequest);
        break;

      default:
        return res.status(404).send();
    }

    return res.end();
  }
});

module.exports = router;
