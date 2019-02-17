# Puzzle Framework Database Repository Module

A unified method to access database using class criteria.

To use this module, add the "@puzzleframework/repository" in your application "package.json"
under the "puzzles" property as up as possible in the list. It will load automatically
the repository class loader.

A repository will provide you with the following things:
  - Simplified database querying using criteria classes - no code duplication
  - Managed create, update, delete actions using criteria classes
  - Paginated data
  - Data validation system

Whenever you want to define a repository class, you will have to import and extend the
RepositoryBase class.

Whenever you want to define a criteria class, you will have to import and extend the
Criteria/CriteriaBase class. We have predefined a generic criteria class called IDCriteria
which will create the seqeuelize query string based on an ID passed by the user. 
