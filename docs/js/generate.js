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

                generateChart();

                let div_table = document.getElementById('div-table');
                div_table.innerHTML = "";

                let table = document.createElement('table');
                table.className = "table";

                let tr1 = table.appendChild(table.appendChild(document.createElement('thead')).appendChild(document.createElement('tr')));
                let th1 = tr1.appendChild(document.createElement('th'));
                th1.style.textAlign = "center";
                th1.appendChild(document.createTextNode('Organisation\'s Name'));

                let th2 = tr1.appendChild(document.createElement('th'));
                th2.style.textAlign = "center";
                th2.appendChild(document.createTextNode('# Repos'));

                for (let i = 0; i < object.length; ++i) {
                    let tr2 = table.appendChild(document.createElement('tr'));

                    tr2.appendChild(document.createElement('td')).appendChild(document.createTextNode(object[i].name));
                    tr2.appendChild(document.createElement('td')).appendChild(document.createTextNode(object[i].nb_repos));
                }

                div_table.appendChild(table);
            }
        };
    });
}

function generateChart() {

    // Return with commas in between
    let numberWithCommas = function (x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    let dataPack1 = [21000, 22000, 26000, 35000, 55000, 55000, 56000, 59000, 60000, 61000, 60100, 62000];
    let dataPack2 = [1000, 1200, 1300, 1400, 1060, 2030, 2070, 4000, 4100, 4020, 4030, 4050];
    let dates = ["May 1", "May 2", "May 3", "May 4", "May 5", "May 6",
        "May 7", "May 8", "May 9", "May 10", "May 11", "May 12"];

    // Chart.defaults.global.elements.rectangle.backgroundColor = '#FF0000';

    let bar_ctx = document.getElementById('div-bar-chart');
    let bar_chart = new Chart(bar_ctx, {
            type: 'bar',
            data: {
                labels: dates,
                datasets: [
                    {
                        label: 'Bowser',
                        data: dataPack1,
                        backgroundColor: "rgba(55, 160, 225, 0.7)",
                        hoverBackgroundColor: "rgba(55, 160, 225, 0.7)",
                        hoverBorderWidth: 2,
                        hoverBorderColor: 'lightgrey'
                    },
                    {
                        label: 'Mario',
                        data: dataPack2,
                        backgroundColor: "rgba(225, 58, 55, 0.7)",
                        hoverBackgroundColor: "rgba(225, 58, 55, 0.7)",
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
                    }],
                    yAxes: [{
                        stacked: true,
                        ticks: {
                            callback: function (value) {
                                return numberWithCommas(value);
                            },
                        },
                    }],
                }, // scales
                legend: {display: true}
            } // options
        }
    );
}