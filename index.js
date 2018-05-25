#!/usr/bin/env node

const prog = require('caporal');
const git = require('simple-git');
const interpolate = require('interpolate');
var request = require('request');

prog
  .version('1.0.0')
  .command('clone', 'Clone everything from Github.')
  .option('--path <path>', 'Select the <path> of the new project.')
  .option('--token <token>', 'Token to execute deep cloning.')
  .action((args, options, logger) => {
    console.log('.::. START TO CLONE THE REPOS .::.');

    for(var i = 1; i < 3; i++){
      var headers = {
        url: 'https://api.github.com/orgs/rootstrap/repos?access_token=' + options.token + '&per_page=100&page=' + i,
        headers: {
          'User-Agent': 'request'
        }
      };
  
      request(headers, function(error, response, body) {
        var list = JSON.parse(body);
        console.log('.::. Repos to clone: ' + list.length +' .::.');
        list.forEach(repo => {
  
          let dst = interpolate('{dir}/{name}', {
            dir: options.path || __dirname,
            name: repo.name
          });
  
          git().clone(repo.clone_url, dst, function(err) {
            console.log('.::. ' + repo.name +  ' cloned! .::.');
          });
        });
      });
    }
  });

prog.parse(process.argv);
