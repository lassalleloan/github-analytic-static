/**
 * Generates a chart when an organization is selected
 * This is called in index.html
 *
 * @author Loan Lassalle (loan.lassalle@heig-vd.ch)
 * @since 13.09.2017
 */
/* eslint-disable semi */

function clearHtml () {
  // Remove old message
  // eslint-disable-next-line no-undef
  document.getElementById('p-message').innerHTML = '';

  // Remove old canvas and add a new one
  // eslint-disable-next-line no-undef
  $('#canvas-bar-chart').remove();
  // eslint-disable-next-line no-undef
  $('#div-bar-chart').append('<canvas id="canvas-bar-chart"><canvas>');

  document.getElementById('div-infos').innerHTML = '';
}

// eslint-disable-next-line no-unused-vars
function changeOrganisationName (organisationLogin) {
  clearHtml();

  if (organisationLogin.length > 0) {
    // let i = 100;
    //
    // const counterBack = setInterval(function () {
    //   i--;
    //   if (i > 0) {
    //     // eslint-disable-next-line no-undef
    //     $('.progress-bar').css('width', i + '%');
    //   } else {
    //     clearInterval(counterBack);
    //   }
    // }, 1000);

    /* global XMLHttpRequest */
    const xhttp = new XMLHttpRequest();

    // Ask the server to generates organization
    xhttp.open('GET', 'https://infinite-earth-87590.herokuapp.com/agent?repository=githubAnalytic-agent&organization=' + organisationLogin);
    xhttp.send();

    document.getElementById('p-message').innerHTML = 'Wait a minute';

    // Callback function when the state is changed
    xhttp.onreadystatechange = () => {
      // eslint-disable-next-line no-undef
      document.getElementById('p-message').innerHTML = '';

      if (xhttp.readyState === XMLHttpRequest.DONE && xhttp.status === 200) {
        if (xhttp.responseText === '/ready') {
          // setTimeout(function () {
          // Gets organization
          xhttp.open('GET', 'https://raw.githubusercontent.com/galahad1/githubAnalytic-agent/master/my-data-file.json');
          xhttp.responseType = 'json';
          xhttp.send();

          // Callback function when the state is changed
          xhttp.onreadystatechange = () => {
            if (xhttp.readyState === XMLHttpRequest.DONE && xhttp.status === 200) {
              // Gets back organization
              // eslint-disable-next-line
              const organization = new Organisation(xhttp.response);

              // eslint-disable-next-line
              const barChartStacked = new BarChartStacked('Name of repos', organization._reposName, 'Number of bytes', organization._languagesBytes);

              barChartStacked.addToContext('canvas-bar-chart');

              generateTable(organization);
            }
          }
          // }, 60000);
        } else {
          // eslint-disable-next-line no-undef
          document.getElementById('p-message').innerHTML = 'The chosen organization does not exist';
        }
      }
    }
  }
}

// eslint-disable-next-line no-unused-vars
function generateTable (organization) {
  const divTable = document.getElementById('div-infos');
  divTable.innerHTML = '';

  // <table>
  const table = document.createElement('table');
  table.className = 'table';

  divTable.appendChild(table);

  // <tr>
  const tr1 = table.appendChild(document.createElement('tr'));
  // <td>
  tr1.appendChild(document.createElement('td')).appendChild(document.createTextNode('Organisation Name'));
  // </td>
  // <td>
  tr1.appendChild(document.createElement('td')).appendChild(document.createTextNode(organization._name));
  // </td>
  // </tr>

  if (organization._description.length > 0) {
    // <tr>
    const tr2 = table.appendChild(document.createElement('tr'));
    // <td>
    tr2.appendChild(document.createElement('td')).appendChild(document.createTextNode('Description'));
    // </td>
    // <td>
    tr2.appendChild(document.createElement('td')).appendChild(document.createTextNode(organization._description));
    // </td>
    // </tr>
  }

  // <tr>
  const tr3 = table.appendChild(document.createElement('tr'));
  // <td>
  tr3.appendChild(document.createElement('td')).appendChild(document.createTextNode('Created at'));
  // </td>
  // <td>
  tr3.appendChild(document.createElement('td')).appendChild(document.createTextNode(organization._createdAt));
  // </td>
  // </tr>

  // <tr>
  const tr4 = table.appendChild(document.createElement('tr'));
  // <td>
  tr4.appendChild(document.createElement('td')).appendChild(document.createTextNode('Number of repos'));
  // </td>
  // <td>
  tr4.appendChild(document.createElement('td')).appendChild(document.createTextNode(organization._reposLength));
  // </td>
  // </tr>

  // <tr>
  const tr5 = table.appendChild(document.createElement('tr'));
  // <td>
  tr5.appendChild(document.createElement('td')).appendChild(document.createTextNode('Number of languages'));
  // </td>
  // <td>
  tr5.appendChild(document.createElement('td')).appendChild(document.createTextNode(organization._languagesNameLength));
  // </td>
  // </tr>

  // <tr>
  const tr6 = table.appendChild(document.createElement('tr'));
  // <td>
  tr6.appendChild(document.createElement('td')).appendChild(document.createTextNode('Minimum of bytes for ' + organization._languageSmallestBytes.name));
  // </td>
  // <td>
  tr6.appendChild(document.createElement('td')).appendChild(document.createTextNode(organization._languageSmallestBytes.nbrBytes));
  // </td>
  // </tr>

  // <tr>
  const tr7 = table.appendChild(document.createElement('tr'));
  // <td>
  tr7.appendChild(document.createElement('td')).appendChild(document.createTextNode('Maximum of bytes for ' + organization._languageBiggestBytes.name));
  // </td>
  // <td>
  tr7.appendChild(document.createElement('td')).appendChild(document.createTextNode(organization._languageBiggestBytes.nbrBytes));
  // </td>
  // </tr>

  // <tr>
  const tr9 = table.appendChild(document.createElement('tr'));
  // <td>
  tr9.appendChild(document.createElement('td')).appendChild(document.createTextNode('Smallest repo'));
  // </td>
  // <td>
  const aTag = document.createElement('a');
  aTag.setAttribute('href', organization._repoSmallestBytes.html_url);
  aTag.innerHTML = organization._repoSmallestBytes.name;
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
  aTag2.setAttribute('href', organization._repoBiggestBytes.html_url);
  aTag2.innerHTML = organization._repoBiggestBytes.name;
  tr10.appendChild(document.createElement('td')).appendChild(aTag2);
  // </td>
  // </tr>

  for (const languageName of organization._languagesName) {
    // <tr>
    const tr8 = table.appendChild(document.createElement('tr'));
    // <td>
    tr8.appendChild(document.createElement('td')).appendChild(document.createTextNode('Number of bytes of ' + languageName));
    // </td>
    // <td>
    tr8.appendChild(document.createElement('td')).appendChild(document.createTextNode(organization._languagesBytesSum[languageName]));
    // </td>
    // </tr>
  }

  // </table>
}
