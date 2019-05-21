"use strict";

const PObject = puzzle.import("core/PObject");
const Sequelize = require("sequelize");

/**
 * Filtering criteria used in repositories to get some specific data.
 *
 * See {@link http://docs.sequelizejs.com/manual/tutorial/querying.html#operators}
 *
 * @memberOf beast.base.Repository
 * @extends @puzzleframework.lite.core.PObject
 */
class CriteriaBase extends PObject {
  /**
   * Constructor for the Criteria class.
   */
  constructor() {
    super();
    /**
     * Operators object. To be used when constructing the where string
     * and you need operators for various comparisons.
     *
     * See {@link http://docs.sequelizejs.com/manual/tutorial/querying.html#operators}
     *
     * @public
     * @property {Sequelize.Op}
     */
    this.Op = Sequelize.Op;
    /**
     * Reference to Sequelize object. This isn't a database connected
     * sequelize instance.
     *
     * @public
     * @property {Sequelize}
     */
    this.Sequelize = Sequelize;
    /**
     * A transaction object if you want the data to be used in a transaction.
     *
     * @public
     * @property {Object}
     */
    this.transaction = null;
    /**
     * A list with models that have to be included.
     *
     * @protected
     * @property {Array}
     */
    this._include = [];
    /**
     * A list with fields on which the query will be grouped by.
     *
     * @protected
     * @property {Array}
     */
    this._group = [];
    /**
     * A dictionary with attributes specific to the query, like
     * which fields to be included or excluded etc.
     *
     * @protected
     * @property {Object}
     */
    this._attributes = {};
    /**
     * A dictionary with conditions used to filter the data in
     * the database.
     *
     * @protected
     * @property {Object}
     */
    this._where = {};
    /**
     * A list with fields on which you want the data to be ordered by.
     *
     * @protected
     * @property {Array}
     */
    this._order = [];

    /**
     * Should the limit be included in the subqueries or not?
     *
     * @protected
     * @property {Boolean}
     */
    this._subQuery = false;
  }

  /**
   * Should the limit be included in the subqueries or not?
   *
   * @return {Boolean}
   */
  get subQuery() {
    return this._subQuery;
  }

  /**
   * Returns the object/array used to build the Criteria
   * for usage with sequelize.
   *
   * @return {Object}
   */
  buildWhereObject() {
    return this._where;
  }

  /**
   * Returns the object/array used to build the Criteria
   * for usage with sequelize.
   *
   * @return {Object}
   */
  buildAttributesObject() {
    return this._attributes;
  }

  /**
   * Returns the object/array used to build the Criteria
   * for usage with sequelize.
   *
   * @return {Array}
   */
  buildIncludeObject() {
    return this._include;
  }

  /**
   * Returns the object/array used to build the Criteria
   * for usage with sequelize.
   *
   * @return {Array}
   */
  buildOrderObject() {
    return this._order;
  }

  /**
   * Returns the object/array used to build the Criteria
   * for usage with sequelize.
   *
   * @return {Array}
   */
  buildGroupObject() {
    return this._group;
  }

  /**
   * Returns the object/array used to build the Criteria
   * for usage with sequelize transactions.
   *
   * @return {Object}
   */
  buildTransactionObject() {
    return this._transaction;
  }
}

module.exports = CriteriaBase;
