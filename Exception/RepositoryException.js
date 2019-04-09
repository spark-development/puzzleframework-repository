"use strict";

const PError = puzzle.import("exceptions/PError");

/**
 * Repository error.
 *
 * @memberOf beast.base.Repository
 * @extends @puzzleframework.lite.exceptions.PError
 */
class RepositoryException extends PError {
  /**
   * Constructor of the repository exception.
   *
   * @param {string} message The error message to be thrown.
   * @param {string} repository The name of the repository from where the error is thrown.
   * @param {*} [details=null] Are there any details related to this error?
   */
  constructor(message, repository, details = null) {
    super(`[${repository}] ${message}`);
    this.details = details;
  }
}

module.exports = RepositoryException;
