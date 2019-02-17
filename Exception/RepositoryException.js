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
   */
  constructor(message, repository) {
    super(`[${repository}] ${message}`);
  }
}

module.exports = RepositoryException;
