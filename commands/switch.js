'use strict';

let cli = require('heroku-cli-util');

let findParentDir = require('find-parent-dir');

let fs = require('fs');

let path = require('path');

let co  = require('co');
let _ = require('lodash');

"use strict";

let utils = require('./utils.js');

require('shelljs/global');


function* switch_env(context, heroku) {
	let envName = context.args.name;
  	let configDir = utils.getConfigDir(context);
	
  	if(!fs.existsSync(configDir)){
  		cli.error("No environment exist yet");
  	}

  	utils.getEnvironments(configDir).then(function(envDict){  		
		if(!_.has(envDict, envName)){
			cli.error("There is no environment named '" + envName + "'");		
		}		

		var selectedEnv = envDict[envName];
		var selectedApp = selectedEnv.app;

		exec("git config heroku.remote " + selectedEnv.remote);

		heroku.apps(selectedApp).configVars().update(selectedEnv.config, function(err, resp){
			if(err){
				console.log("Failed to update configuration", err);
			}else{
				console.log("Environment Configuration Updated", resp);
			}
		});
  	}, function(error){
  		cli.error(error);
  	});
}

module.exports = {
	topic: 'env',
	command: 'switch',
	description: 'switch to specified environment',
	args: [{name: 'name', description: 'name of the environment to switch to'}],
	flags: [{name: 'dir', char: 'd', hasValue: true, description: 'path to the directory containing env config file'}],
	needsApp: true,
  	needsAuth: true,
	run: cli.command(co.wrap(switch_env))	
};