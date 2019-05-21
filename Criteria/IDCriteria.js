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
   */
  constructor(id) {
    super();

    this._where = {
      id
    };
  }
}

module.exports = IDCriteria;
