const dbHelper = require('../db/db-helper');

/** @type {Collection<LendingRequest>} */
let collection;

function init() {
  collection = dbHelper.db.getCollection('lending-requets') || dbHelper.db.addCollection('lending-requests');
}

function findAll() {
  return collection.find();
}

/**
 * 
 * @param {Partial<LendingRequest>} options 
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
 */
function findByLineUserId(lineUserId) {
  return collection.find({ lineUserId });
}

/**
 * 
 * @param {LendingRequest} lendingRequest 
 */
function insert(lendingRequest) {
  return collection.insert(lendingRequest);
}

function save(lendingRequest) {
  return collection.update(lendingRequest);
}

function remove(lendingRequest) {
  collection.remove(lendingRequest);
}

module.exports = {
  init,
  find,
  findAll,
  findOneById,
  findByLineUserId,
  insert,
  save,
  remove
}

/**
 * @typedef {Object} LendingRequest
 * @property {string} id
 * @property {string} lineUserId
 * @property {number} amount
 * @property {number} period - Payment period in days
 * @property {'installment'|'whole'} paymentMethod
 */
