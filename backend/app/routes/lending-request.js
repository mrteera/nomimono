const express = require('express');

const lrRepo = require('../repository/lending-request-respository');

const router = express.Router();

router.get('', (req, res) => {
  const lrs = lrRepo.findAll();
  res.json(lrs);
});

router.get('/:id', (req, res) => {
  const id = req.params.id;
  const lr = lrRepo.findOneById(id);
  res.json(lr);
});

router.post('', (req, res) => {
  const body = req.body;
  const { originalDetectIntentRequest, queryResult } = body;
  const { action, queryText } = queryResult;
  const lineUserId = originalDetectIntentRequest.payload.data.source.userId;
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
});

router.patch('/:id', (req, res) => {
  const id = req.params.id;
  let lr = lrRepo.findOneById(id);
  res.json(lr);
});

router.delete('/:id', (req, res) => {
  const id = req.params.id;
  const lr = lrRepo.findOneById(id);
  lrRepo.remove(lr);
  res.status(204).send();
});

module.exports = router;
