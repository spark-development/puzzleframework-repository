"use strict";

const PObject = puzzle.import("core/PObject");

const RepositoryBase = require("./RepositoryBase");

/**
 * Repository store - used to load repositories in memory.
 *
 * @memberOf @puzzleframework.repository
 * @extends @puzzleframework.lite.core.PObject
 */
class RepositoryLoader extends PObject {
  /**
   * Constructor of the Repository Loader.
   */
  constructor() {
    super();

    this._repositories = {};
  }

  /**
   * Pushes a repository onto the engine, to be used throughout the framework.
   *
   * @param {RepositoryBase} repository The repository to be added into the framework.
   */
  push(repository) {
    let r;
    if (repository instanceof RepositoryBase) {
      r = repository;
    } else if (repository.prototype instanceof RepositoryBase) {
      r = new repository();
    }
    this._repositories[r.className] = r;
  }

  /**
   * Returns the repository from the application.
   *
   * @param {string} repository The repository name to be fetched.
   *
   * @return {Object}
   */
  get(repository) {
    return this._repositories[repository];
  }
}

module.exports = RepositoryLoader;
