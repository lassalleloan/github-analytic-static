$(document).ready(function () {
    let xhttp = new XMLHttpRequest();

    // Settings
    const NB_ENTRIES = 10;

    // Makes the request to get the data
    xhttp.open("GET", "https://raw.githubusercontent.com/lassalleloan/githubAnalytic-static/master/docs/data/data.json");
    xhttp.responseType = "json";
    xhttp.send();

    // Callback function when the state is changed
    xhttp.onreadystatechange = () => {

        // If everything is okay
        if (xhttp.readyState === XMLHttpRequest.DONE && xhttp.status === 200) {

            let object = xhttp.response;

            // Add dynamically all the repos to the table
            for (let i = 0; i < object.length; ++i) {
                $("table").append(`<tr><td>${object[i].name}</td><td>${object[i].nb_repos}</td></tr>`);
            }
        }
    };

});