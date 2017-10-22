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
          // Gets organization json
          const xhttp1 = new XMLHttpRequest();
          xhttp1.open('GET', 'https://raw.githubusercontent.com/lassalleloan/githubAnalytic-static/master/docs/data/organization.json');
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
        } else {
          // eslint-disable-next-line no-undef
          document.getElementById('p-message').innerHTML = 'The chosen organization does not exist';
        }
      }
    }
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

  const table = document.createElement('table');
  table.className = 'table';
  divTable.appendChild(table);

  for (const key in organization._summary) {
    if (organization._summary.hasOwnProperty(key)) {
      const tr = table.appendChild(document.createElement('tr'));
      tr.appendChild(document.createElement('td')).appendChild(document.createTextNode(key));
      tr.appendChild(document.createElement('td')).appendChild(document.createTextNode(organization._summary[key]));
    }
  }

  const tr = table.appendChild(document.createElement('tr'));
  const a = document.createElement('a');
  tr.appendChild(document.createElement('td')).appendChild(document.createTextNode('Smallest repo'));
  a.setAttribute('href', organization._repoSmallestBytes.html_url);
  a.innerHTML = organization._repoSmallestBytes.name;
  tr.appendChild(document.createElement('td')).appendChild(a);

  const tr2 = table.appendChild(document.createElement('tr'));
  const a2 = document.createElement('a');
  tr2.appendChild(document.createElement('td')).appendChild(document.createTextNode('Biggest repo'));
  tr2.appendChild(document.createElement('td')).appendChild(a2);
  a2.setAttribute('href', organization._repoBiggestBytes.html_url);
  a2.innerHTML = organization._repoBiggestBytes.name;

  for (const languageName of organization._languagesName) {
    const tr = table.appendChild(document.createElement('tr'));
    tr.appendChild(document.createElement('td')).appendChild(document.createTextNode('Number of bytes of ' + languageName));
    tr.appendChild(document.createElement('td')).appendChild(document.createTextNode(organization._languagesBytesSum[languageName]));
  }
}
