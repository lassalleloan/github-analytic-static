function changeOrganisationName(organisationName) {
    $(document).ready(function () {
        let xhttp = new XMLHttpRequest();

        // Get data
        xhttp.open('GET', 'https://raw.githubusercontent.com/lassalleloan/githubAnalytic-static/master/docs/data/data.json');
        xhttp.responseType = "json";
        xhttp.send();

        // Callback function when the state is changed
        xhttp.onreadystatechange = () => {
            if (xhttp.readyState === XMLHttpRequest.DONE && xhttp.status === 200) {
                let object = xhttp.response;

                let organisation = getOrganisation(object, organisationName);
                let repos = getRepos(organisation);

                $('#canvas-bar-chart').remove();
                $('#div-bar-chart').append('<canvas id="canvas-bar-chart"><canvas>');

                generateChart(repos);
                generateTable(organisation);
            }
        };
    });
}

function getOrganisation(object, organisationName) {
    for (let i = 0; i < object.length; ++i) {
        if (object[i].name === organisationName) {
            return object[i];
        }
    }
}

function getRepos(organisation) {
    let repos = [];

    for (let i = 0; i < organisation.repos.length; ++i) {
        repos.push(organisation.repos[i]);
    }

    return repos;
}

function getReposName(repos) {
    let reposName = [];

    for (let i = 0; i < repos.length; ++i) {
        reposName.push(repos[i].name);
    }

    return reposName;
}

function getLanguages(repo) {
    let languages = [];

    for (let i = 0; i < repo.languages.length; ++i) {
        languages.push(repo.languages[i]);
    }

    return languages;
}

function getLanguage(repos, language) {
    let bytes = [];

    for (let i = 0; i < repos.length; ++i) {
        for (let j = 0; j < repos[i].languages.length; ++j) {
            if (repos[i].languages[j].name === language)
                bytes.push(repos[i].languages[j].bytes);
        }
    }

    return bytes;
}

function generateChart(repos) {

    // Return with commas in between
    let numberWithCommas = function (x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    let c = getLanguage(repos, "c");
    let cpp = getLanguage(repos, "cpp");
    let csharp = getLanguage(repos, "csharp");
    let java = getLanguage(repos, "java");
    let javascript = getLanguage(repos, "javascript");
    let html = getLanguage(repos, "html");
    let pearl = getLanguage(repos, "pearl");
    let php = getLanguage(repos, "php");
    let pyhton = getLanguage(repos, "pyhton");
    let rust = getLanguage(repos, "rust");
    let swift = getLanguage(repos, "swift");

    let bar_ctx = document.getElementById('canvas-bar-chart');
    let bar_chart = new Chart(bar_ctx, {
            type: 'bar',
            data: {
                labels: getReposName(repos),
                datasets: [
                    {
                        label: 'C',
                        data: c,
                        backgroundColor: color = getRandomColor(),
                        hoverBackgroundColor: color,
                        hoverBorderWidth: 2,
                        hoverBorderColor: 'lightgrey'
                    },
                    {
                        label: 'C++',
                        data: cpp,
                        backgroundColor: color = getRandomColor(),
                        hoverBackgroundColor: color,
                        hoverBorderWidth: 2,
                        hoverBorderColor: 'lightgrey'
                    },
                    {
                        label: 'C#',
                        data: csharp,
                        backgroundColor: color = getRandomColor(),
                        hoverBackgroundColor: color,
                        hoverBorderWidth: 2,
                        hoverBorderColor: 'lightgrey'
                    },
                    {
                        label: 'Java',
                        data: java,
                        backgroundColor: color = getRandomColor(),
                        hoverBackgroundColor: color,
                        hoverBorderWidth: 2,
                        hoverBorderColor: 'lightgrey'
                    },
                    {
                        label: 'Javascript',
                        data: javascript,
                        backgroundColor: color = getRandomColor(),
                        hoverBackgroundColor: color,
                        hoverBorderWidth: 2,
                        hoverBorderColor: 'lightgrey'
                    },
                    {
                        label: 'HTML',
                        data: html,
                        backgroundColor: color = getRandomColor(),
                        hoverBackgroundColor: color,
                        hoverBorderWidth: 2,
                        hoverBorderColor: 'lightgrey'
                    },
                    {
                        label: 'Pearl',
                        data: pearl,
                        backgroundColor: color = getRandomColor(),
                        hoverBackgroundColor: color,
                        hoverBorderWidth: 2,
                        hoverBorderColor: 'lightgrey'
                    },
                    {
                        label: 'PHP',
                        data: php,
                        backgroundColor: color = getRandomColor(),
                        hoverBackgroundColor: color,
                        hoverBorderWidth: 2,
                        hoverBorderColor: 'lightgrey'
                    },
                    {
                        label: 'Python',
                        data: pyhton,
                        backgroundColor: color = getRandomColor(),
                        hoverBackgroundColor: color,
                        hoverBorderWidth: 2,
                        hoverBorderColor: 'lightgrey'
                    },
                    {
                        label: 'Rust',
                        data: rust,
                        backgroundColor: color = getRandomColor(),
                        hoverBackgroundColor: color,
                        hoverBorderWidth: 2,
                        hoverBorderColor: 'lightgrey'
                    },
                    {
                        label: 'Swift',
                        data: swift,
                        backgroundColor: color = getRandomColor(),
                        hoverBackgroundColor: color,
                        hoverBorderWidth: 2,
                        hoverBorderColor: 'lightgrey'
                    },
                ]
            },
            options: {
                animation: {
                    duration: 10,
                },
                tooltips: {
                    mode: 'label',
                    callbacks: {
                        label: function (tooltipItem, data) {
                            return data.datasets[tooltipItem.datasetIndex].label + ": " + numberWithCommas(tooltipItem.yLabel);
                        }
                    }
                },
                scales: {
                    xAxes: [{
                        stacked: true,
                        gridLines: {display: false},
                        scaleLabel: {
                            display: true,
                            labelString: 'Name of repos'
                        }
                    }],
                    yAxes: [{
                        stacked: true,
                        ticks: {
                            callback: function (value) {
                                return numberWithCommas(value);
                            },
                        },
                        scaleLabel: {
                            display: true,
                            labelString: 'Proportion of language'
                        }
                    }],
                }, // scales
                legend: {
                    display: true
                }
            } // options
        }
    );
}

function getRandomColor() {
    return "#" + ((1 << 24) * Math.random() | 0).toString(16);
}

function generateTable(organisation) {
    let repos = getRepos(organisation);

    let div_table = document.getElementById('div-table');
    div_table.innerHTML = "";

    let table = document.createElement('table');
    table.className = "table";

    let tr1 = table.appendChild(table.appendChild(document.createElement('thead')).appendChild(document.createElement('tr')));
    let th1 = tr1.appendChild(document.createElement('th'));
    th1.style.textAlign = "center";
    th1.appendChild(document.createTextNode('Repo\'s Name'));

    let languages = getLanguages(repos[0]);

    for (let j = 0; j < languages.length; ++j) {
        let th2 = tr1.appendChild(document.createElement('th'));
        th2.style.textAlign = "center";
        th2.appendChild(document.createTextNode(languages[j].name));
    }

    for (let i = 0; i < repos.length; ++i) {
        let tr2 = table.appendChild(document.createElement('tr'));

        tr2.appendChild(document.createElement('td')).appendChild(document.createTextNode(repos[i].name));

        let languages = getLanguages(repos[i]);

        for (let j = 0; j < languages.length; ++j) {
            tr2.appendChild(document.createElement('td')).appendChild(document.createTextNode(languages[j].bytes));
        }
    }

    div_table.appendChild(table);
}