const dbHelper = require('../db/db-helper');

/** @type {Collection} */
let collection;

function init() {
  collection = dbHelper.db.getCollection('machings');
}

/**
 * @returns {Maching[]}
 */
function findAll() {
  return collection.find();
}

/**
 * @param {string} id 
 * @returns {Maching}
 */
function findOneById(id) {
  return collection.findOne({ id });
}

/**
 * @param {Maching} maching 
 * @returns {Maching}
 */
function insert(maching) {
  return collection.insert(maching);
}

/**
 * @param {Maching} maching 
 * @returns {Maching}
 */
function update(maching) {
  return collection.update(maching);
}

/**
 * @param {Maching} maching 
 */
function remove(maching) {
  return collection.remove(maching);
}

module.exports = {
  init,
  findAll,
  findOneById,
  insert,
  update,
  remove
}


/**
 * @typedef {Object} Maching
 * @property {string} id
 * @property {string} lendingRequestId
 * @property {string} borrowingRequestId
 * @property {boolean} lenderAccepted
 * @property {boolean} borrowerAccepted
 * @property {Payment} lenderPayment
 * @property {Payment[]} borrowerPayments
 */

/**
 * @typedef {Object} Payment
 * @property {number} amount
 * @property {string} transactionId
 * @property {'pending'|'success'|'failed'} status 
 */
