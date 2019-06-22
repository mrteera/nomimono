const dbHelper = require('../db/db-helper');

/** @type {Collection<BorrowingRequest>} */
let collection;

function init() {
  collection = dbHelper.db.getCollection('borrowing-requests') || dbHelper.db.addCollection('borrowing-requests');
}

function findAll() {
  return collection.find();
}

/**
 * @param {Partial<BorrowingRequest>} options
 */
function find(options) {
  return collection.find(options);
}

/** 
 * @param {string} id 
 */
function findOneById(id) {
  return collection.find({ id });
}

/**
 * 
 * @param {string} lineUserId 
 * @returns {BorrowingRequest|undefined}
 */
function findLastBorrowingRequestByLineUserId(lineUserId) {
  return collection.find({ lineUserId: lineUserId }).splice(-1)[0];
}

/**
 * @param {BorrowingRequest} borrowingRequest 
 */
function insert(borrowingRequest) {
  return collection.insert(borrowingRequest);
}

/**
 * @param {BorrowingRequest} borrowingRequest 
 */
function save(borrowingRequest) {
  return collection.update(borrowingRequest);
}

/**
 * @param {BorrowingRequest} borrowingRequest 
 */
function remove(borrowingRequest) {
  collection.remove(borrowingRequest);
}

module.exports = {
  init,
  findAll,
  find,
  findOneById,
  findLastBorrowingRequestByLineUserId,
  insert,
  save,
  remove
}

/**
 * @typedef {Object} BorrowingRequest
 * @property {string} id
 * @property {string} lineUserId
 * @property {number} amount
 * @property {number} period
 * @property {'installment'|'whole'} paymentMethod
 * @property {string} purpose
 * @property {'pending'|'paid'} status
 */
