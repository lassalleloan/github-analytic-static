/**
 * Gets back data from json file
 * This is called in index.html
 *
 * @author Loan Lassalle (loan.lassalle@heig-vd.ch)
 * @since 13.09.2017
 */
/* eslint-disable semi */

// eslint-disable-next-line no-unused-vars
function Data (organisationName, xhttpResponse) {
  this._organisationName = organisationName;
  this._organisations = xhttpResponse.organisations;

  // Organisation object
  this.organisation = (function () {
    for (let organisation of this._organisations) {
      if (this._organisationName === organisation.name) {
        return organisation
      }
    }
  }.call(this));

  // Repos array
  this._repos = this.organisation.repos;

  // Return true if value already exist
  let unique = function (value, index, self) {
    return self.indexOf(value) === index
  };

  // Repos name array
  this._reposName = (function () {
    let reposName = [];

    for (let repo of this._repos) {
      reposName.push(repo.name)
    }

    return reposName.filter(unique).sort()
  }.call(this));

  // Languages array
  this._languages = (function () {
    let languages = [];

    for (let repo of this._repos) {
      for (let language of repo.languages) {
        languages.push(language)
      }
    }

    return languages
  }.call(this));

  // Languages name array
  this._languagesName = (function () {
    let languagesName = [];

    for (let language of this._languages) {
      languagesName.push(language.name)
    }

    return languagesName.filter(unique).sort()
  }.call(this));

  // Gets languages name array of a repo
  this.getLanguagesName = function (repo) {
    let languagesName = [];

    for (let language of repo.languages) {
      languagesName.push(language.name)
    }

    return languagesName.filter(unique)
  };

  // Gets bytes proportions of language in a repo
  this.getLanguagesBytes = function (repo, languageName) {
    for (let language of repo.languages) {
      if (languageName === language.name) {
        return language.bytes
      }
    }
  };

  // Bytes proportions of languages
  this._languagesBytes = (function () {
    let bytes = {};

    for (let languageName of this._languagesName) {
      bytes[languageName] = []
    }

    for (let repo of this._repos) {
      for (let languageName of this._languagesName) {
        if (this.getLanguagesName(repo).contains(languageName)) {
          bytes[languageName].push(this.getLanguagesBytes(repo, languageName))
        } else {
          bytes[languageName].push(0)
        }
      }
    }

    return bytes
  }.call(this))
}

// eslint-disable-next-line no-extend-native
Array.prototype.contains = function (obj) {
  let i = this.length;

  while (i--) {
    if (this[i] === obj) {
      return true
    }
  }

  return false
};
