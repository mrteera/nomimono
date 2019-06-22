const dbHelper = require('../db/db-helper');

/** @type {Collection} */
let collection;

function init() {
  collection = dbHelper.db.getCollection('users') || dbHelper.db.addCollection('users');
}

/**
 * @returns {User[]}
 */
function findAll() {
  return collection.find();
}

/**
 * @param {string} phoneNumber 
 * @returns {User}
 */
function findOneByPhoneNumber(phoneNumber) {
  return collection.findOne({ phoneNumber });
}

/**
 * @param {string} lineId 
 * @returns {User}
 */
function findOneByLineId(lineId) {
  return collection.findOne({ lineId });
}

/**
 * @param {User} user 
 */
function insert(user) {
  collection.insert(user);
}

/**
 * @param {User} user 
 */
function save(user) {
  collection.update(user);
}

/**
 * 
 * @param {User} user 
 */
function remove(user) {
  collection.remove(user);
}

module.exports = {
  init,
  findAll,
  findOneByLineId,
  findOneByPhoneNumber,
  insert,
  save,
  remove
}

/**
 * @typedef {Object} User
 * @property {string} lineId
 * @property {string} phoneNumber
 * @property {string} scbAccountNumber
 * @property {string} scbAuthToken
 * @property {CustomerProfile} customerProfile
 */

/**
 * @typedef {Object} CustomerProfile
 * @property {string} citizenId
 * @property {string} passportNumber
 * @property {string} alienId
 * @property {string} partnerId
 * @property {string} thaiFirstName
 * @property {string} thaiLastName
 * @property {string} engFirstName
 * @property {string} engLastName
 * @property {string} birthData
 * @property {'M'|'FM'} genderCode
 * @property {string} mobile
 * @property {string} email
 * @property {Address} address
 */

/**
 * @typedef {Object} Address
 * @property {string} addressSeqId
 * @property {string} usageCode
 * @property {string} ownerCode
 * @property {string} formatCode
 * @property {string} contactIndicator
 * @property {string} currentAddressFlag
 * @property {string} thaiAddressNumber
 * @property {string} thaiAddressVillage
 * @property {string} thaiAddressMoo
 * @property {string} thaiAddressTrok
 * @property {string} thaiAddressSoi
 * @property {string} thaiAddressThanon
 * @property {string} thaiAddressDistrict
 * @property {string} thaiAddressAmphur
 * @property {string} thaiAddressProvince
 * @property {string} thaiAddressState
 */
