/**
 * Gets back data from json file
 * This is called in index.html
 *
 * @author Loan Lassalle (loan.lassalle@heig-vd.ch)
 * @since 13.09.2017
 */
/* eslint-disable semi */

// eslint-disable-next-line no-unused-vars
function Organization (xhttpResponse) {
  this._login = xhttpResponse.login;
  this._name = xhttpResponse.name === null ? this._login : xhttpResponse.name;
  this._description = xhttpResponse.description === null ? '' : xhttpResponse.description;

  const createdAt = new Date(xhttpResponse.created_at);
  this._createdAt = (createdAt.getMonth() + 1) + '/' + createdAt.getDate() + '/' + createdAt.getFullYear();

  /**
   * Sorts by name
   */
  const sortName = function (a, b) {
    if (a.name < b.name) {
      return -1
    }

    if (a.name > b.name) {
      return 1
    }

    return 0
  };

  /**
   * Checks if value is unique
   */
  const unique = function (value, index, self) {
    return self.indexOf(value) === index
  };

  /**
   * Repos sorted by name
   */
  const repos = xhttpResponse.repos.sort(sortName);

  /**
   * Name of repos
   */
  this._reposName = (function () {
    const reposName = [];

    for (const repo of repos) {
      reposName.push(repo.name)
    }

    return reposName
  }());

  this._reposLength = repos.length;

  /**
   * Gets number of bytes for a repo and a language
   */
  const getLanguagesBytes = function (repo, languageName) {
    for (const language of repo.languages) {
      if (languageName === language.name) {
        return language.nbrBytes
      }
    }
  };

  /**
   * Number of bytes by repos
   */
  this._reposBytesSum = (function () {
    const bytes = {};

    for (const repoName of this._reposName) {
      bytes[repoName] = 0
    }

    for (const repo of repos) {
      for (const language of repo.languages) {
        bytes[repo.name] += getLanguagesBytes(repo, language.name)
      }
    }

    return bytes
  }.call(this));

  /**
   * Biggest repo by number bytes
   */
  this._repoBiggestBytes = (function () {
    let repoBiggestBytes = {
      name: '',
      html_url: '',
      created_at: '',
      nbrBytes: 0
    };

    for (const repo of repos) {
      if (this._reposBytesSum[repo.name] > repoBiggestBytes.nbrBytes) {
        repoBiggestBytes = {
          name: repo.name,
          html_url: repo.html_url,
          created_at: repo.created_at,
          nbrBytes: this._reposBytesSum[repo.name]
        }
      }
    }

    return repoBiggestBytes
  }.call(this));

  /**
   * Smallest repo by number bytes
   */
  this._repoSmallestBytes = (function () {
    let repoSmallestBytes = this._repoBiggestBytes;

    for (const repo of repos) {
      if (this._reposBytesSum[repo.name] < repoSmallestBytes.nbrBytes) {
        repoSmallestBytes = {
          name: repo.name,
          html_url: repo.html_url,
          created_at: repo.created_at,
          nbrBytes: this._reposBytesSum[repo.name]
        }
      }
    }

    return repoSmallestBytes
  }.call(this));

  /**
   * Languages sorted by name
   */
  const languages = (function () {
    const languages = [];

    for (const repo of repos) {
      for (const language of repo.languages) {
        languages.push(language)
      }
    }

    return languages.sort(sortName)
  }());

  /**
   * Name of languages
   */
  this._languagesName = (function () {
    const languagesName = [];

    for (const language of languages) {
      languagesName.push(language.name)
    }

    return languagesName.filter(unique)
  }.call(this));

  this._languagesNameLength = this._languagesName.length;

  /**
   * Gets name of languages of a repo
   */
  const getLanguagesName = function (repo) {
    const languagesName = [];

    for (const language of repo.languages) {
      languagesName.push(language.name)
    }

    return languagesName.sort(sortName)
  };

  /**
   * Number of bytes by repos and languages
   */
  this._languagesBytes = (function () {
    const bytes = {};

    for (const languageName of this._languagesName) {
      bytes[languageName] = []
    }

    for (const repo of repos) {
      for (const languageName of this._languagesName) {
        if (getLanguagesName(repo).contains(languageName)) {
          bytes[languageName].push(getLanguagesBytes(repo, languageName))
        } else {
          bytes[languageName].push(0)
        }
      }
    }

    return bytes
  }.call(this));

  /**
   * Number of bytes by languages
   */
  this._languagesBytesSum = (function () {
    const bytesSum = {};

    for (const languageName of this._languagesName) {
      bytesSum[languageName] = 0
    }

    for (const languageName of this._languagesName) {
      for (const bytes of this._languagesBytes[languageName]) {
        bytesSum[languageName] += bytes
      }
    }

    return bytesSum
  }.call(this));

  /**
   * Biggest language by number bytes
   */
  this._languageBiggestBytes = (function () {
    let languageBiggestBytes = {
      name: '',
      nbrBytes: 0
    };

    for (const languageName of this._languagesName) {
      if (this._languagesBytesSum[languageName] > languageBiggestBytes.nbrBytes) {
        languageBiggestBytes = {
          name: languageName,
          nbrBytes: this._languagesBytesSum[languageName]
        }
      }
    }

    return languageBiggestBytes
  }.call(this));

  /**
   * Smallest language by number bytes
   */
  this._languageSmallestBytes = (function () {
    let languageSmallestMin = this._languageBiggestBytes;

    for (const languageName of this._languagesName) {
      if (this._languagesBytesSum[languageName] < languageSmallestMin.nbrBytes) {
        languageSmallestMin = {
          name: languageName,
          nbrBytes: this._languagesBytesSum[languageName]
        }
      }
    }

    return languageSmallestMin
  }.call(this));

  this._summary = (function () {
    const summary = {};

    summary['Organization Name'] = this._name;

    if (this._description.length > 0) {
      summary['Description'] = this._description;
    }

    summary['Created at'] = this._createdAt;
    summary['Number of repos'] = this._reposLength;
    summary['Number of languages'] = this._languagesNameLength;

    const minimumBytesFor = 'Minimum of bytes for ' + this._languageSmallestBytes.name;
    summary[minimumBytesFor] = this._languagesNameLength;

    const maximumBytesFor = 'Maximum of bytes for ' + this._languageSmallestBytes.name;
    summary[maximumBytesFor] = this._languagesNameLength;

    return summary;
  }.call(this));
}

/**
 * Checks if object is in array
 *
 * @param obj object to check
 * @returns {boolean} true if object is in array, false otherwise
 */
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
