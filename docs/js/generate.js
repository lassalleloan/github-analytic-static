/**
 * Generates a chart when an organization is selected
 * This is called in index.html
 *
 * @author Loan Lassalle (loan.lassalle@heig-vd.ch)
 * @since 13.09.2017
 */
/* eslint-disable semi */

/**
 * Generates a chart and a table in function of oragnization login
 *
 * @param organizationLogin organization login
 */
// eslint-disable-next-line no-unused-vars
function changeOrganizationName (organizationLogin) {
  document.getElementById('p-message').innerHTML = '';

  // Remove old canvas and add a new one
  // eslint-disable-next-line no-undef
  $('#canvas-bar-chart').remove();
  // eslint-disable-next-line no-undef
  $('#div-bar-chart').append('<canvas id="canvas-bar-chart"><canvas>');

  document.getElementById('div-infos').innerHTML = '';

  if (organizationLogin.length > 0) {
    /* global XMLHttpRequest */
    const xhttp = new XMLHttpRequest();

    // Ask the server to generates organization
    xhttp.open('GET', 'https://infinite-earth-87590.herokuapp.com/agent?repository=githubAnalytic-static&organization=' + organizationLogin);
    xhttp.send();

    document.getElementById('p-message').innerHTML = 'Wait a minute';

    // Callback function when the state is changed
    xhttp.onreadystatechange = () => {
      if (xhttp.readyState === XMLHttpRequest.DONE && xhttp.status === 200) {
        if (xhttp.responseText === '/ready') {
          setTimeout(function () {
            // Gets organization json
            const xhttp1 = new XMLHttpRequest();
            xhttp1.open('GET', 'data/organization.json');
            xhttp1.responseType = 'json';
            xhttp1.send();

            // Callback function when the state is changed
            xhttp1.onreadystatechange = () => {
              if (xhttp1.readyState === XMLHttpRequest.DONE && xhttp1.status === 200) {
                document.getElementById('p-message').innerHTML = '';

                // Gets back organization
                // eslint-disable-next-line
                const organization = new Organization(xhttp1.response);

                // eslint-disable-next-line
                const barChartStacked = new BarChartStacked('Name of repos', organization._reposName, 'Number of bytes', organization._languagesBytes);
                barChartStacked.addToContext('canvas-bar-chart');

                generateTable(organization);
              }
            }
          }, 10000);
        } else {
          // eslint-disable-next-line no-undef
          document.getElementById('p-message').innerHTML = 'The chosen organization does not exist';
        }
      }
    }
  }
}

/**
 *
 *
 * @param organizationLogin organization login
 */
// eslint-disable-next-line no-unused-vars
function refresh (organizationLogin) {
  document.getElementById('p-message').innerHTML = '';

  // Remove old canvas and add a new one
  // eslint-disable-next-line no-undef
  $('#canvas-bar-chart').remove();
  // eslint-disable-next-line no-undef
  $('#div-bar-chart').append('<canvas id="canvas-bar-chart"><canvas>');

  document.getElementById('div-infos').innerHTML = '';

  if (organizationLogin.length > 0) {
    // Gets organization json
    const xhttp = new XMLHttpRequest();
    xhttp.open('GET', 'data/organization.json');
    xhttp.responseType = 'json';
    xhttp.send();

    // Callback function when the state is changed
    xhttp.onreadystatechange = () => {
      if (xhttp.readyState === XMLHttpRequest.DONE && xhttp.status === 200) {
        // Gets back organization
        // eslint-disable-next-line
        const organization = new Organization(xhttp.response);

        // eslint-disable-next-line
        const barChartStacked = new BarChartStacked('Name of repos', organization._reposName, 'Number of bytes', organization._languagesBytes);
        barChartStacked.addToContext('canvas-bar-chart');

        generateTable(organization);
      }
    }
  } else {
    // eslint-disable-next-line no-undef
    document.getElementById('p-message').innerHTML = 'The chosen organization does not exist';
  }
}

/**
 * Generates a table of informations of organization
 *
 * @param organization organization object
 */
// eslint-disable-next-line no-unused-vars
function generateTable (organization) {
  const divTable = document.getElementById('div-infos');
  divTable.innerHTML = '';

  // <table>
  const table = document.createElement('table');
  table.className = 'table';
  divTable.appendChild(table);

  for (const key in organization._summary) {
    if (organization._summary.hasOwnProperty(key)) {
      const tr1 = table.appendChild(document.createElement('tr'));
      tr1.appendChild(document.createElement('td')).appendChild(document.createTextNode(key));
      tr1.appendChild(document.createElement('td')).appendChild(document.createTextNode(organization._summary[key]));
    }
  }

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
    const tr = table.appendChild(document.createElement('tr'));
    tr.appendChild(document.createElement('td')).appendChild(document.createTextNode('Number of bytes of ' + languageName));
    tr.appendChild(document.createElement('td')).appendChild(document.createTextNode(organization._languagesBytesSum[languageName]));
  }
}
