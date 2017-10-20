/**
 * Generates a chart when an organisation is selected
 * This is called in index.html
 *
 * @author Loan Lassalle (loan.lassalle@heig-vd.ch)
 * @since 13.09.2017
 */
/* eslint-disable semi */

// eslint-disable-next-line no-unused-vars
function changeOrganisationName (organisationName) {
  // eslint-disable-next-line no-undef
  $(document).ready(function () {
    /* global XMLHttpRequest */
    let xhttp = new XMLHttpRequest();

    // Get data
    xhttp.open('GET', 'https://raw.githubusercontent.com/lassalleloan/githubAnalytic-static/master/docs/data/data.json');
    xhttp.responseType = 'json';
    xhttp.send();

    // Callback function when the state is changed
    xhttp.onreadystatechange = () => {
      if (xhttp.readyState === XMLHttpRequest.DONE && xhttp.status === 200) {
        // Remove old canvas and add a new one
        // eslint-disable-next-line no-undef
        $('#canvas-bar-chart').remove();
        // eslint-disable-next-line no-undef
        $('#div-bar-chart').append('<canvas id="canvas-bar-chart"><canvas>');

        // eslint-disable-next-line
        let data = new Data(organisationName, xhttp.response);

        // eslint-disable-next-line
        let barChartStacked = new BarChartStacked('Name of repos', data._reposName, 'Proportion of language (bytes)', data._languagesBytes);
        barChartStacked.addToContext('canvas-bar-chart');

        generateTable(data._reposName, data._languagesName, data._languagesBytes)
      }
    }
  })
}

function generateTable (reposName, languagesName, languagesBytes) {
  let divTable = document.getElementById('div-table');
  divTable.innerHTML = '';

  // <table>
  let table = document.createElement('table');
  table.className = 'table';

  // <thead>
  let thead = table.appendChild(document.createElement('thead'));

  // <tr>
  let theadRow1 = thead.appendChild(document.createElement('tr'));

  // <td>
  let th1 = theadRow1.appendChild(document.createElement('th'));
  th1.style.textAlign = 'center';
  th1.appendChild(document.createTextNode('Repo\'s Name'));
  // </td>

  for (let languageName of languagesName) {
    // <td>
    let th2 = theadRow1.appendChild(document.createElement('th'));
    th2.style.textAlign = 'center';
    th2.appendChild(document.createTextNode(languageName))
    // </td>
  }
  // </tr>
  // </thead>

  for (let i = 0; i < reposName.length; ++i) {
    let tr2 = table.appendChild(document.createElement('tr'));

    // <td>
    tr2.appendChild(document.createElement('td')).appendChild(document.createTextNode(reposName[i]));
    // </td>

    for (let languageName of languagesName) {
      // <td>
      tr2.appendChild(document.createElement('td')).appendChild(document.createTextNode(languagesBytes[languageName][i]))
      // </td>
    }
    // </tr>
  }
  // </table>

  divTable.appendChild(table)
}
