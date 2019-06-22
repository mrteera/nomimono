const express = require('express');

const brrRepo = require('../repository/borrowing-request-repository');

const router = express.Router();

router.get('', (req, res) => {
  const brs = brrRepo.findAll();
  res.json(brs);
});

router.get('/:id', (req, res) => {
  const id = req.params.id;
  const br = brrRepo.findOneById(id);
  res.json(br);
});

router.post('/', (req, res) => {
  const body = req.body;
  const { originalDetectIntentRequest, queryResult } = body;
  const { action, queryText } = queryResult;
  const lineUserId = originalDetectIntentRequest.payload.data.source.userId;
  const lastRequest = brrRepo.find({ lineUserId: lineUserId }).splice(-1)[0];
  if (action != 'RequestLoan_SelectType.type') {
    if (!lastRequest || (lastRequest.purpose && lastRequest.paymentMethod && lastRequest.period && lastRequest.amount)) {
      return req.status(400).send();
    }

    switch (action) {
      case 'RequestLoan_SelectType.type':
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
        return req.status(404).send();
    }

    res.end();
  }
});

router.patch('/:id', (req, res) => {
  const id = req.params.id;
  const brParams = req.body.br;
  const br = brrRepo.findOneById(id);
  brrRepo.remove(br);
});

router.delete('/:id', (req, res) => {
  const id = req.params.id;
  const br = brrRepo.findOneById(id);
  brrRepo.remove(br);
  res.status(204).send();
});

module.exports = router;
