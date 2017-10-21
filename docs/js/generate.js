/**
 * Generates a chart when an organisation is selected
 * This is called in index.html
 *
 * @author Loan Lassalle (loan.lassalle@heig-vd.ch)
 * @since 13.09.2017
 */
/* eslint-disable semi */

// eslint-disable-next-line no-unused-vars
function changeOrganisationName (organisationLogin) {
  if (organisationLogin.length > 0) {
    // eslint-disable-next-line no-undef
    $(document).ready(function () {
      /* global XMLHttpRequest */
      const xhttp = new XMLHttpRequest();

      xhttp.open('POST', 'localhost:7410/agent?organization=' + organisationLogin + '&repository=githubAnalytic-agent');
      xhttp.send('data');

      // Callback function when the state is changed
      xhttp.onreadystatechange = () => {
        if (xhttp.readyState === XMLHttpRequest.DONE && xhttp.status === 200) {
          const message = xhttp.responseText;

          if (message === '/ready') {
            // eslint-disable-next-line no-undef
            $(document).ready(function () {
              /* global XMLHttpRequest */
              const xhttp = new XMLHttpRequest();

              // Get data
              xhttp.open('GET', 'https://raw.githubusercontent.com/galahad1/githubAnalytic-agent/master/my-data-file.json');
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
                  const data = new Organisation(xhttp.response);

                  // eslint-disable-next-line
                  const barChartStacked = new BarChartStacked('Name of repos', data._reposName, 'Proportion of language (bytes)', data._languagesBytes);
                  barChartStacked.addToContext('canvas-bar-chart');

                  generateTable(data);
                }
              }
            });
          } else {
            // eslint-disable-next-line no-undef
            $('#div-message').append('<p class="p-3" style="color:red">Error</p><br>');
          }
        }
      }
    });

  }
}

// eslint-disable-next-line no-unused-vars
function generateTable (data) {
  const divTable = document.getElementById('div-infos');
  divTable.innerHTML = '';

  // <table>
  const table = document.createElement('table');
  table.className = 'table';

  // <tr>
  const tr1 = table.appendChild(document.createElement('tr'));
  // <td>
  tr1.appendChild(document.createElement('td')).appendChild(document.createTextNode('Organisation Name'));
  // </td>
  // <td>
  tr1.appendChild(document.createElement('td')).appendChild(document.createTextNode(data._name));
  // </td>
  // </tr>

  if (data._description.length > 0) {
    // <tr>
    const tr2 = table.appendChild(document.createElement('tr'));
    // <td>
    tr2.appendChild(document.createElement('td')).appendChild(document.createTextNode('Description'));
    // </td>
    // <td>
    tr2.appendChild(document.createElement('td')).appendChild(document.createTextNode(data._description));
    // </td>
    // </tr>
  }

  // <tr>
  const tr3 = table.appendChild(document.createElement('tr'));
  // <td>
  tr3.appendChild(document.createElement('td')).appendChild(document.createTextNode('Created at'));
  // </td>
  // <td>
  tr3.appendChild(document.createElement('td')).appendChild(document.createTextNode(data._createdAt));
  // </td>
  // </tr>

  // <tr>
  const tr4 = table.appendChild(document.createElement('tr'));
  // <td>
  tr4.appendChild(document.createElement('td')).appendChild(document.createTextNode('Number of repos'));
  // </td>
  // <td>
  tr4.appendChild(document.createElement('td')).appendChild(document.createTextNode(data._reposLength));
  // </td>
  // </tr>

  // <tr>
  const tr5 = table.appendChild(document.createElement('tr'));
  // <td>
  tr5.appendChild(document.createElement('td')).appendChild(document.createTextNode('Number of languages'));
  // </td>
  // <td>
  tr5.appendChild(document.createElement('td')).appendChild(document.createTextNode(data._languagesNameLength));
  // </td>
  // </tr>

  // <tr>
  const tr6 = table.appendChild(document.createElement('tr'));
  // <td>
  tr6.appendChild(document.createElement('td')).appendChild(document.createTextNode('Minimum of bytes for ' + data._languageSmallestBytes.name));
  // </td>
  // <td>
  tr6.appendChild(document.createElement('td')).appendChild(document.createTextNode(data._languageSmallestBytes.nbrBytes));
  // </td>
  // </tr>

  // <tr>
  const tr7 = table.appendChild(document.createElement('tr'));
  // <td>
  tr7.appendChild(document.createElement('td')).appendChild(document.createTextNode('Maximum of bytes for ' + data._languageBiggestBytes.name));
  // </td>
  // <td>
  tr7.appendChild(document.createElement('td')).appendChild(document.createTextNode(data._languageBiggestBytes.nbrBytes));
  // </td>
  // </tr>

  // <tr>
  const tr9 = table.appendChild(document.createElement('tr'));
  // <td>
  tr9.appendChild(document.createElement('td')).appendChild(document.createTextNode('Smallest repo'));
  // </td>
  // <td>
  const aTag = document.createElement('a');
  aTag.setAttribute('href', data._repoSmallestBytes.html_url);
  aTag.innerHTML = data._repoSmallestBytes.name;
  tr9.appendChild(document.createElement('td')).appendChild(aTag);
  // </td>
  // </tr>

  // <tr>
  const tr10 = table.appendChild(document.createElement('tr'));
  // <td>
  tr10.appendChild(document.createElement('td')).appendChild(document.createTextNode('Biggest repo'));
  // </td>
  // <td>
  const aTag2 = document.createElement('a');
  aTag2.setAttribute('href', data._repoBiggestBytes.html_url);
  aTag2.innerHTML = data._repoBiggestBytes.name;
  tr10.appendChild(document.createElement('td')).appendChild(aTag2);
  // </td>
  // </tr>

  for (const languageName of data._languagesName) {
    // <tr>
    const tr8 = table.appendChild(document.createElement('tr'));
    // <td>
    tr8.appendChild(document.createElement('td')).appendChild(document.createTextNode('Number of bytes of ' + languageName));
    // </td>
    // <td>
    tr8.appendChild(document.createElement('td')).appendChild(document.createTextNode(data._languagesBytesSum[languageName]));
    // </td>
    // </tr>
  }

  // </table>

  divTable.appendChild(table)
}
