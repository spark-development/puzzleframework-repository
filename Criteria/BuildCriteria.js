"use strict";

/**
 * Removes an uninitialized object from the given object.
 *
 * @param {Object} object The object on which we check.
 * @param {string} key The key we want to check.
 */
function removeInvalidObject(object, key) {
  if (object[key] === null || object[key] === undefined) {
    delete object[key];
  }
}

/**
 * Removes an uninitialized array from the given object.
 *
 * @param {Object} object The object on which we check.
 * @param {string} key The key we want to check.
 */
function removeInvalidArray(object, key) {
  if (object[key] === null || object[key] === undefined || object[key].length === 0) {
    delete object[key];
  }
}

/**
 * Function used to transform a Class Criteria into a object that can
 * be used by sequelize.
 *
 * @memberOf @puzzleframework.repository.Criteria
 *
 * @param {CriteriaBase} criteria The criteria to be transformed.
 *
 * @return {Object}
 */
module.exports = (criteria) => {
  if (criteria === null || criteria === undefined) {
    return {};
  }

  const toReturn = {
    where: criteria.buildWhereObject(),
    attributes: criteria.buildAttributesObject(),
    include: criteria.buildIncludeObject(),
    order: criteria.buildOrderObject(),
    group: criteria.buildGroupObject(),
    transaction: criteria.transaction,
    subQuery: criteria.subQuery !== undefined && criteria.subQuery !== null ? criteria.subQuery : false,
    distinct: criteria.distinct !== undefined && criteria.distinct !== null ? criteria.distinct : true
  };

  removeInvalidObject(toReturn, "where");
  removeInvalidObject(toReturn, "attributes");
  removeInvalidObject(toReturn, "transaction");
  removeInvalidArray(toReturn, "include");
  removeInvalidArray(toReturn, "order");
  removeInvalidArray(toReturn, "group");

  return toReturn;
};
