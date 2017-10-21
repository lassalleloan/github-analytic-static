/**
 * Gets back data from json file
 * This is called in index.html
 *
 * @author Loan Lassalle (loan.lassalle@heig-vd.ch)
 * @since 13.09.2017
 */
/* eslint-disable semi */

// eslint-disable-next-line no-unused-vars
function Organisation (xhttpResponse) {
  this._login = xhttpResponse.login;
  this._name = xhttpResponse.name;
  this._description = xhttpResponse.description;

  const createdAt = new Date(xhttpResponse.created_at);
  this._createdAt = (createdAt.getMonth() + 1) + '/' + createdAt.getDate() + '/' + createdAt.getFullYear();

  // Return true if value already exist
  const unique = function (value, index, self) {
    return self.indexOf(value) === index;
  };

  const repos = xhttpResponse.repos;

  // Repos name array
  this._reposName = (function () {
    const reposName = [];

    for (const repo of repos) {
      reposName.push(repo.name);
    }

    return reposName.filter(unique).sort();
  }());

  this._reposLength = repos.length;

  // Gets bytes proportions of language in a repo
  const getLanguagesBytes = function (repo, languageName) {
    for (const language of repo.languages) {
      if (languageName === language.name) {
        return language.nbrBytes;
      }
    }
  };

  this._reposBytesSum = (function () {
    const bytes = {};

    for (const repoName of this._reposName) {
      bytes[repoName] = 0;
    }

    for (const repo of repos) {
      for (const language of repo.languages) {
        bytes[repo.name] += getLanguagesBytes(repo, language.name);
      }
    }

    return bytes
  }.call(this));

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
        };
      }
    }

    return repoBiggestBytes;
  }.call(this));

  this._repoSmallestBytes = (function () {
    let repoSmallestBytes = this._repoBiggestBytes;

    for (const repo of repos) {
      if (this._reposBytesSum[repo.name] < repoSmallestBytes.nbrBytes) {
        repoSmallestBytes = {
          name: repo.name,
          html_url: repo.html_url,
          created_at: repo.created_at,
          nbrBytes: this._reposBytesSum[repo.name]
        };
      }
    }

    return repoSmallestBytes;
  }.call(this));

  // Languages array
  const languages = (function () {
    const languages = [];

    for (const repo of repos) {
      for (const language of repo.languages) {
        languages.push(language);
      }
    }

    return languages;
  }());

  // Languages name array
  this._languagesName = (function () {
    const languagesName = [];

    for (const language of languages) {
      languagesName.push(language.name);
    }

    return languagesName.filter(unique).sort();
  }.call(this));

  this._languagesNameLength = this._languagesName.length;

  // Gets languages name array of a repo
  const getLanguagesName = function (repo) {
    const languagesName = [];

    for (const language of repo.languages) {
      languagesName.push(language.name);
    }

    return languagesName.filter(unique).sort();
  };

  // Bytes proportions of languages
  this._languagesBytes = (function () {
    const bytes = {};

    for (const languageName of this._languagesName) {
      bytes[languageName] = [];
    }

    for (const repo of repos) {
      for (const languageName of this._languagesName) {
        if (getLanguagesName(repo).contains(languageName)) {
          bytes[languageName].push(getLanguagesBytes(repo, languageName));
        } else {
          bytes[languageName].push(0);
        }
      }
    }

    return bytes
  }.call(this));

  this._languagesBytesSum = (function () {
    const bytesSum = {};

    for (const languageName of this._languagesName) {
      bytesSum[languageName] = 0;
    }

    for (const languageName of this._languagesName) {
      for (const bytes of this._languagesBytes[languageName]) {
        bytesSum[languageName] += bytes;
      }
    }

    return bytesSum;
  }.call(this));

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
        };
      }
    }

    return languageBiggestBytes;
  }.call(this));

  this._languageSmallestBytes = (function () {
    let languageSmallestMin = this._languageBiggestBytes;

    for (const languageName of this._languagesName) {
      if (this._languagesBytesSum[languageName] < languageSmallestMin.nbrBytes) {
        languageSmallestMin = {
          name: languageName,
          nbrBytes: this._languagesBytesSum[languageName]
        };
      }
    }

    return languageSmallestMin;
  }.call(this));
}

// eslint-disable-next-line no-extend-native
Array.prototype.contains = function (obj) {
  let i = this.length;

  while (i--) {
    if (this[i] === obj) {
      return true;
    }
  }

  return false;
};
