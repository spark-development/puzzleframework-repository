"use strict";

const CriteriaBase = require("./CriteriaBase");

/**
 * ID filter Criteria.
 *
 * @memberOf @puzzleframework.repository.Criteria
 * @extends @puzzleframework.repository.Exception.CriteriaBase
 */
class IDCriteria extends CriteriaBase {
  /**
   * Constructor of the ID filter Criteria
   *
   * @param {string} id The ID on which we filter.
   * @param {Object|null} [transaction=null] The transaction object if you want
   *                                         the data to be used in a transaction.
   */
  constructor(id, transaction = null) {
    super();

    this.transaction = transaction;

    this._where = {
      id
    };
  }
}

module.exports = IDCriteria;
