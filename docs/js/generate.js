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
                $('#canvas-bar-chart').remove();
                $('#div-bar-chart').append('<canvas id="canvas-bar-chart"><canvas>');

                let data = new Data(organisationName, xhttp.response);
                let barChartStacked = new BarChartStacked('canvas-bar-chart', data.reposName, data.datasets, 'Name of repos', 'Proportion of language');
                generateTable(data.reposName, data.languagesName, data.languagesBytes);
            }
        };
    });
}

function generateTable(reposName, languagesName, languagesBytes) {
    let div_table = document.getElementById('div-table');
    div_table.innerHTML = "";

    let table = document.createElement('table');
    table.className = "table";

    let tr1 = table.appendChild(table.appendChild(document.createElement('thead')).appendChild(document.createElement('tr')));
    let th1 = tr1.appendChild(document.createElement('th'));
    th1.style.textAlign = "center";
    th1.appendChild(document.createTextNode('Repo\'s Name'));

    for (let i = 0; i < languagesName.length; ++i) {
        let th2 = tr1.appendChild(document.createElement('th'));
        th2.style.textAlign = "center";
        th2.appendChild(document.createTextNode(languagesName[i]));
    }

    for (let i = 0; i < reposName.length; ++i) {
        let tr2 = table.appendChild(document.createElement('tr'));

        tr2.appendChild(document.createElement('td')).appendChild(document.createTextNode(reposName[i]));

        for (let j = 0; j < languagesName.length; ++j) {
            tr2.appendChild(document.createElement('td')).appendChild(document.createTextNode(languagesBytes[languagesName[j]][i]));
        }
    }

    div_table.appendChild(table);
}