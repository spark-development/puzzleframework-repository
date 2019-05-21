"use strict";

const PRuntime = puzzle.import("puzzle/PServerRuntime");

const RepositoryLoader = require("./RepositoryLoader");

/**
 * Repository related module
 *
 * @namespace @puzzleframework.repository
 */

/**
 * Initialization class for the beast.base module.
 *
 * @extends @puzzleframework.lite.puzzle.PServerRuntime
 * @memberOf @puzzleframework.repository
 */
class PuzzleRepository extends PRuntime {
  constructor() {
    super();

    puzzle.set("repository", new RepositoryLoader());
  }
}

module.exports = PuzzleRepository;
