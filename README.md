# TWEB :: GitHub Analytics :: Organisation
Authors: Tano Iannetta & Loan Lassalle
***

## Architecture
The GitHub analytics projects is base on a client and a agent side.

### Client
The client side of the project is hosted directly on github via GitHub Pages. You can consult the [website](https://lassalleloan.github.io/githubAnalytic-static/ "GitHub Analytics Static").

### Agent
In the background, an agent working to publish updated data on GitHub for the client. The agent's code is available [here](https://github.com/galahad1/githubAnalytic-agent "GitHub Analytics Agent").
The agent is deployed in the cloud on [Heroku](https://www.heroku.com/ "Heroku Website"). Read the repo's [README](https://github.com/heroku/heroku-repo/ "Heroku Repo") to know more about it.

## Local use

In order to use a local client server, you can proceed with the following steps :

1) Install and run docker
2) Run bash script docker_run at the root of the repo's folder

The client will still fetch data from [here](https://raw.githubusercontent.com/galahad1/githubAnalytic-agent/master/my-data-file.json "Data")

If you want to change the source of the data, please update line 18 in the "generate.js" file. Make sure to have the appropriate data format.

## Data Format

The data of the client and fetching is formatted in a certain way. You can't change the format if you want the client to work "out of the box".

Here is how the JSON file is structured :

{
  "login": "QubesOS",
  "name": "Qubes OS Project",
  "url": "https://api.github.com/orgs/QubesOS",
  "description": "",
  "created_at": "2014-12-16T20:43:04Z",
  "repos": [
    {
      "name": "qubes-app-linux-split-gpg",
      "html_url": "https://github.com/QubesOS/qubes-app-linux-split-gpg",
      "id": 30624135,
      "languages_url": "https://api.github.com/repos/QubesOS/qubes-app-linux-split-gpg/languages",
      "created_at": "2015-02-11T01:27:27Z",
      "languages": [
        {
          "name": "C",
          "nbrBytes": 38686
        },
        {
          "name": "Python",
          "nbrBytes": 33107
        },
        {
          "name": "Makefile",
          "nbrBytes": 6302
        },
        {
          "name": "Shell",
          "nbrBytes": 4410
        }
      ]
    },

    ...

  ]
}
