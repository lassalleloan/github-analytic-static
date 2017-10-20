# TWEB :: GitHub Analytics :: Organisation
Authors: Tano Iannetta & Loan Lassalle
***

## Architecture
The GitHub analytics projects is base on a client and a agent side.

### Client
The client side of the project is hosted directly on github via GitHub Pages. You can consult the [website](https://lassalleloan.github.io/githubAnalytic-static/ "GitHub Analytics Static").

### Agent
In the background, an agent working to publish updated data on GitHub for the client. The agent's code is available [here](https://github.com/galahad1/githubAnalytic-agent "GitHub Analytics Agent").
The agent is deployed in the cloud on [Heroku](https://www.heroku.com/ "Heroku Website"). Read the repo's [README](https://github.com/heroku/heroku-repo "Heroku Repo") to know more about it.

## Local use

In order to use a local client server, you can proceed with the following steps :

1) Install "http-server" from npm
2) Install required dependencies with npm install (when in the repo's folder)
3) In the repo's root folder, run "http-server ." to run the server locally.

The client will still fetch data from [here](https://raw.githubusercontent.com/lassalleloan/githubAnalytic-static/master/docs/data/data.json "Data")

If you want to change the source of the data, please update line 18 in the "generate.js" file. Make sure to have the appropriate data format.

## Data Format

The data of the client and fetching is formatted in a certain way. You can't change the format if you want the client to work "out of the box".

Here is how the JSON file is structured :