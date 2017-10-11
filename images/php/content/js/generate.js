$(document).ready(function () {
    let xhttp = new XMLHttpRequest();

    // Get data
    xhttp.open("GET", "https://raw.githubusercontent.com/lassalleloan/githubAnalytic-static/master/docs/data/data.json");
    xhttp.responseType = "json";
    xhttp.send();

    // Callback function when the state is changed
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState === XMLHttpRequest.DONE && xhttp.status === 200) {
            let object = xhttp.response;

            // Add all organisations to the table
            for (let i = 0; i < object.length; ++i) {
                $("table").append(`<tr><td>${object[i].name}</td><td>${object[i].nb_repos}</td></tr>`);
            }
        }
    };
});