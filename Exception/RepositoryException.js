"use strict";

const PError = puzzle.import("exceptions/PError");

/**
 * Repository error.
 *
 * @memberOf @puzzleframework.repository.Exception
 * @extends @puzzleframework.lite.exceptions.PError
 */
class RepositoryException extends PError {
  /**
   * Constructor of the repository exception.
   *
   * @param {string} message The error message to be thrown.
   * @param {string} repository The name of the repository from where the error is thrown.
   * @param {*} [error=null] Are there any details related to this error?
   */
  constructor(message, repository, error = null) {
    super(`[${repository}] ${message}`);

    if (error === null || error === undefined) {
      return;
    }

    if (error.details) {
      this.details = error.details;
      return;
    }

    this.details = [
      {
        message: this._extractDetailedMessage(error),
        errors: error.errors,
      }
    ];
  }

  _extractDetailedMessage(error) {
    console.log(error);
    if(error.original === undefined || error.original === null) {
      return error.message;
    }

    return error.original.sqlMessage || error.message;
  }
}

module.exports = RepositoryException;
