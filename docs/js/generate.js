/**
 * Generates a chart when an organization is selected
 * This is called in index.html
 *
 * @author Loan Lassalle (loan.lassalle@heig-vd.ch)
 * @since 13.09.2017
 */

/* eslint-disable semi */

/* global XMLHttpRequest */

/**
 * Generates a chart and a table in function of oragnization login
 *
 * @param organizationLogin organization login
 */
// eslint-disable-next-line no-unused-vars
function changeOrganizationName (organizationLogin) {
  clearHtml();

  /**
   * Url to gets json file of data
   * @type {string}
   */
    // eslint-disable-next-line no-unused-vars
  let jsonURL = 'https://raw.githubusercontent.com/lassalleloan/githubAnalytic-static/master/docs/data/';

  /**
   * Url to ask the server to generates json file of data
   * @type {string}
   */
    // eslint-disable-next-line no-unused-vars
  let agentURL = 'https://infinite-earth-87590.herokuapp.com/agent?repository=githubAnalytic-static&organization=';

  if (organizationLogin.length > 0) {
    jsonURL += organizationLogin + '.json';
    agentURL += organizationLogin;

    // Gets organization json
    const xhttp = new XMLHttpRequest();
    xhttp.open('GET', jsonURL);
    xhttp.responseType = 'json';
    xhttp.send();

    xhttp.onreadystatechange = () => {
      if (xhttp.readyState === XMLHttpRequest.DONE && xhttp.status === 404) {
        // Ask the server to generates organization JSON
        xhttp.open('GET', agentURL);
        xhttp.send();

        document.getElementById('p-message').innerHTML = 'Loading';

        xhttp.onreadystatechange = () => {
          if (xhttp.readyState === XMLHttpRequest.DONE && xhttp.status === 200) {
            if (xhttp.responseText === '/ready') {
              // Gets organization json
              xhttp.open('GET', jsonURL);
              xhttp.responseType = 'json';
              xhttp.send();

              xhttp.onreadystatechange = () => {
                if (xhttp.readyState === XMLHttpRequest.DONE && xhttp.status === 200) {
                  addContent(xhttp.response);
                }
              };
            } else {
              document.getElementById('p-message').innerHTML = 'The chosen organization does not exist';
            }
          }
        };
      } else if (xhttp.readyState === XMLHttpRequest.DONE && xhttp.status === 200) {
        addContent(xhttp.response);
      }
    };
  }
}

/**
 * Clears HTML for insertion of chart and table
 */
function clearHtml () {
  document.getElementById('p-message').innerHTML = '';

  // Remove old canvas and add a new one
  // eslint-disable-next-line no-undef
  $('#canvas-bar-chart').remove();
  // eslint-disable-next-line no-undef
  $('#div-bar-chart').append('<canvas id="canvas-bar-chart"><canvas>');

  document.getElementById('div-infos').innerHTML = '';
}

/**
 * Adds content in HTML
 *
 * @param xhttpResponse xhttp response
 */
function addContent (xhttpResponse) {
  document.getElementById('p-message').innerHTML = '';

  // Gets back organization
  // eslint-disable-next-line
  const organization = new Organization(xhttpResponse);

  // eslint-disable-next-line
  const barChartStacked = new BarChartStacked('Name of repos', organization._reposName, 'Number of bytes', organization._languagesBytes);
  barChartStacked.addToContext('canvas-bar-chart');

  generateTable(organization);

  document.getElementById('canvas-bar-chart').scrollIntoView();
}

/**
 * Generates a table of informations of organization
 *
 * @param organization organization object
 */
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
