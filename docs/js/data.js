function Data(organisationName, xhttpResponse) {
    this.organisationName = organisationName;
    this.organisations = xhttpResponse.organisations;

    // Return true if value already exist
    let unique = function (value, index, self) {
        return self.indexOf(value) === index;
    };

    // Organisation object
    this.organisation = (function () {
        for (let index = 0; index < this.organisations.length; ++index) {
            if (this.organisationName === this.organisations[index].name) {
                return this.organisations[index];
            }
        }
    }).call(this);

    // Repos array
    this.repos = this.organisation.repos;

    // Repos name arrays
    this.reposName = (function () {
        let reposName = [];

        for (let i = 0; i < this.repos.length; ++i) {
            reposName.push(this.repos[i].name);
        }

        return reposName.filter(unique);
    }).call(this);

    // Languages array
    this.languages = (function () {
        let languages = [];

        for (let i = 0; i < this.repos.length; ++i) {
            for (let j = 0; j < this.repos[i].languages.length; ++j) {
                languages.push(this.repos[i].languages[j]);
            }
        }

        return languages;
    }).call(this);

    // Languages name array
    this.languagesName = (function () {
        let languagesName = [];

        for (let i = 0; i < this.languages.length; ++i) {
            languagesName.push(this.languages[i].name);
        }

        return languagesName.filter(unique);
    }).call(this);

    // Bytes proportions of languages
    this.languagesBytes = (function () {

        // Languages name array of a repo
        this.getLanguagesNameRepo = function (repo) {
            let languagesName = [];

            for (let i = 0; i < repo.languages.length; ++i) {
                languagesName.push(repo.languages[i].name);
            }

            return languagesName.filter(unique);
        };

        // Bytes proportions of language in a repo
        this.getBytes = function (repo, languageName) {
            for (let i = 0; i < repo.languages.length; ++i) {
                if (languageName === repo.languages[i].name) {
                    return repo.languages[i].bytes;
                }
            }
        };

        let bytes = {};

        for (let i = 0; i < this.languagesName.length; ++i) {
            bytes[this.languagesName[i]] = [];
        }

        for (let i = 0; i < this.repos.length; ++i) {
            for (let j = 0; j < this.languagesName.length; ++j) {
                if (this.getLanguagesNameRepo(this.repos[i]).contains(this.languagesName[j])) {
                    bytes[this.languagesName[j]].push(this.getBytes(this.repos[i], this.languagesName[j]));
                } else {
                    bytes[this.languagesName[j]].push(0);
                }
            }
        }

        return bytes;
    }).call(this);

    // Datasets for chart
    this.datasets = (function () {

        // Return random color
        let getRandomColor = function () {
            return "#" + ((1 << 24) * Math.random() | 0).toString(16);
        };

        let datasets = [];

        for (let i = 0; i < this.languagesName.length; ++i) {
            datasets.push({
                label: this.languagesName[i],
                data: this.languagesBytes[this.languagesName[i]],
                backgroundColor: color = getRandomColor(),
                hoverBackgroundColor: color,
                hoverBorderWidth: 2,
                hoverBorderColor: 'lightgrey'
            });
        }

        return datasets;
    }).call(this);
}

Array.prototype.contains = function (obj) {
    let i = this.length;

    while (i--) {
        if (this[i] === obj) {
            return true;
        }
    }

    return false;
};