"use strict";

const _ = require("lodash");

const PObject = puzzle.import("core/PObject");

const BuildCriteria = require("./Criteria/BuildCriteria");
const IDCriteria = require("./Criteria/IDCriteria");
const RepositoryException = require("./Exception/RepositoryException");

/**
 * The repository base object. It provides some default functionality
 * to be able to work with a data storage.
 *
 * @abstract
 * @memberOf @puzzleframework.repository
 * @extends @puzzleframework.lite.core.PObject
 */
class RepositoryBase extends PObject {
  /**
   * Repository base constructor. It initializes the repository
   * with the model on which various tasks will be performed.
   *
   * @param {string} model The name of the model.
   */
  constructor(model) {
    super();
    /**
     * The model used by this Repository.
     *
     * @property {sequelize.Model}
     * @public
     */
    this.model = puzzle.models.get(model);

    /**
     * Validator used by the repository to validate data.
     *
     * @property {Joi|null}
     * @public
     */
    this.validator = null;

    /**
     * Should the validator be called automatically?
     *
     * @property {boolean}
     * @public
     */
    this.autoValidation = false;

    /**
     * The name of the model used by this repository.
     *
     * @property {string}
     * @protected
     */
    this._modelName = model;
  }

  /**
   * Used to extract the correct data from the data
   * passed by the user to the application.
   *
   * @param {Object} data The data sent by the user
   * @param {boolean} [createMode] Are we creating a new item?
   *
   * @return {Object}
   */
  pickData(data, createMode = false) {
    return _.pick(
      data,
      this.isValid(this.validator)
        ? Object.keys(this.validator(createMode || false))
        : Object.keys(data)
    );
  }

  /**
   * Validate the data passed by the user.
   *
   * @param {Object} data The data that needs validation.
   * @param {boolean} [createMode] Are we creating a new item?
   *
   * @return {Object}
   */
  validate(data, createMode = false) {
    return this.isValid(this.validator)
      ? puzzle.Joi.validate(
        data,
        this.validator(createMode || false),
        {
          language: puzzle.models.joiLanguage
        }
      )
      : { error: null };
  }

  /**
   * Returns all the data that matches the given criteria.
   *
   * @throws RepositoryException
   *
   * @param {CriteriaBase} criteria The criteria used to filter data.
   *
   * @return {Object}
   */
  async all(criteria) {
    try {
      return await this.model
        .findAll(BuildCriteria(criteria));
    } catch (e) {
      throw new RepositoryException(e.message, this._modelName, e);
    }
  }

  /**
   * Returns all the data that matches the given criteria,
   * in a paginated way.
   *
   * @throws RepositoryException
   *
   * @param {CriteriaBase} criteria The criteria used to filter data.
   * @param {number} [page] The number of the page.
   * @param {number} [pageSize] How many elements should we return.
   *
   * @return {Object}
   */
  async allPaginated(criteria, page = 1, pageSize = 10) {
    const resultCriteria = BuildCriteria(criteria);

    page = page || 1;
    pageSize = pageSize || 10;

    try {
      return await this.model
        .findAndCountAll(_.merge(resultCriteria, {
          offset: (page - 1) * pageSize,
          limit: pageSize
        }));
    } catch (e) {
      throw new RepositoryException(e.message, this._modelName, e);
    }
  }

  /**
   * Returns one element that matches the given criteria.
   *
   * @throws RepositoryException
   *
   * @param {CriteriaBase} criteria The criteria used to filter data.
   *
   * @return {Object}
   */
  async one(criteria) {
    try {
      return await this.model
        .findOne(BuildCriteria(criteria));
    } catch (e) {
      throw new RepositoryException(e.message, this._modelName, e);
    }
  }

  /**
   * Returns the element with the given ID.
   *
   * @param {string} id The ID of the element.
   * @throws RepositoryException
   *
   * @return {Object}
   */
  oneById(id) {
    return this.one(new IDCriteria(id));
  }

  /**
   * Auto validate the given element.
   *
   * @async
   *
   * @protected
   *
   * @param {Object} data The data to be validated.
   * @param {string} [mode=""] The mode which calls the data validation.
   * @param {Object|null} [originalData=null] The original data from the database.
   */
  async _autoValidate(data, mode = "", originalData = null) {
    const createMode = mode === "create";

    let toValidate = {};
    if (this.isValid(originalData)) {
      toValidate = originalData;
    }
    _.extend(toValidate, data);

    data = this.pickData(toValidate, createMode);
    await this.validate(data, createMode);
  }

  /**
   * Creates a new instance of the model in the database.
   *
   * @param {Object} data The data we have to store.
   * @param {Object} [options={}] The options object to include also.
   * @param {Array|null} [options.include=null] The additional models to include also.
   * @param {Object|null} [options.transaction=null] The transaction to use for the creation.
   * @throws RepositoryException
   *
   * @return {Object}
   */
  async create(data, options = {}) {
    this._removeBadStuff(data);
    await this._beforeSave(data, "create");

    try {
      if (this.autoValidation) {
        await this._autoValidate(data, "create");
      }
      const newModel = await this.model
        .create(data, options);

      return this._afterSave(newModel, "create", data);
    } catch (e) {
      throw new RepositoryException(e.message, this._modelName, e);
    }
  }

  /**
   * Creates multiple elements of the model in the database.
   *
   * @param {Array} data The data we have to store.
   * @param {Object} [options={}] The options object to include also.
   * @param {Array|null} [options.include=null] The additional models to include also.
   * @param {Object|null} [options.transaction=null] The transaction to use for the creation.
   * @throws RepositoryException
   *
   * @return {Array|Object}
   */
  async bulkCreate(data, options = {}) {
    data.forEach((v) => {
      this._removeBadStuff(v);
    });
    await this._beforeSave(data, "bulkCreate");

    try {
      if (this.autoValidation) {
        for (const element of data) {
          await this._autoValidate(element, "create");
        }
      }

      const newModels = await this.model
        .bulkCreate(data, options);

      return this._afterSave(newModels, "bulkCreate");
    } catch (e) {
      throw new RepositoryException(e.message, this._modelName, e);
    }
  }

  /**
   * Updates the element with the given ID.
   *
   * @param {string} id The ID of the element we want to update.
   * @param {Array} data The data we need to store.
   * @param {Object|null} [transaction=null] The transaction we want to use.
   * @throws RepositoryException
   *
   * @return {Object}
   */
  update(id, data, transaction = null) {
    return this.updateByCriteria(new IDCriteria(id, transaction), data);
  }

  /**
   * Deletes the element with the given ID.
   *
   * @param {string} id The ID of the element we want to delete.
   * @param {Object|null} [transaction=null] The transaction we want to use.
   * @throws RepositoryException
   *
   * @return {Object}
   */
  delete(id, transaction = null) {
    return this.deleteByCriteria(new IDCriteria(id, transaction));
  }

  /**
   * Updates the element with the given find criteria.
   *
   * @param {CriteriaBase} criteria The Criteria used to identify the element
   *                                we want to update.
   * @param {Array} data The data we need to store.
   * @throws RepositoryException
   *
   * @return {Object}
   */
  async updateByCriteria(criteria, data) {
    this._removeBadStuff(data);
    await this._beforeSave(data, "update");

    try {
      const currentModel = await this.model.findOne(BuildCriteria(criteria));
      if (this.autoValidation) {
        await this._autoValidate(data, "update", currentModel.toJSON());
      }
      _.extend(currentModel, data);
      await currentModel.save();

      return this._afterSave(currentModel, "update", data);
    } catch (e) {
      throw new RepositoryException(e.message, this._modelName, e);
    }
  }

  /**
   * Deletes the element with the given find criteria.
   *
   * @param {CriteriaBase} criteria The Criteria used to identify the element
   *                                we want to delete.
   * @throws RepositoryException
   *
   * @return {Object}
   */
  async deleteByCriteria(criteria) {
    try {
      let currentModel = await this.model.findOne(BuildCriteria(criteria));
      currentModel = await this._beforeSave(currentModel, "delete");

      return currentModel.destroy();
    } catch (e) {
      throw new RepositoryException(e.message, this._modelName, e);
    }
  }

  /**
   * Called after the save has been performed, in order to perform some
   * other tasks on the data stored in the database.
   *
   * @protected
   * @param {Object|Array} model The model(s) we want to do something with.
   * @param {string} when When was this method called.
   * @param {Object|Array} [extraData] Data sent by the user.
   *
   * @return {Object|Array}
   */
  _afterSave(model, when, extraData) {
    switch (when) {
      case "create":
      case "update":
      case "delete":
      default:
        puzzle.log.debug("After Save");
        break;
    }
    return model;
  }

  /**
   * Called before the save is going to be performed, in order to perform some
   * other tasks on the data that has to be stored in the database.
   *
   * @protected
   * @param {Object|Array} model The model(s) we want to do something with.
   * @param {string} when When was this method called.
   *
   * @return {Object|Array}
   */
  _beforeSave(model, when) {
    switch (when) {
      case "create":
      case "update":
      case "delete":
      default:
        puzzle.log.debug("Before Save");
        break;
    }

    return model;
  }

  /**
   * Deletes some illegal elements from the data to be stored in the database.
   *
   * @protected
   *
   * @param {Object} data The data to be fixed.
   */
  _removeBadStuff(data) {
    const toAvoid = ["id", "updatedAt", "createdAt"];

    toAvoid.forEach((element) => {
      if (data[element] !== null && data[element] !== undefined) {
        delete data[element];
      }
    });
  }
}

module.exports = RepositoryBase;
