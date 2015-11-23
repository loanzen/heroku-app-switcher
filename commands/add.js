'use strict';

let cli = require('heroku-cli-util');

let fs = require('fs');

let path = require('path');

let co  = require('co');

let utils = require('./utils.js');


function* add_env(context, heroku) {
	let envName = context.args.name;
	let appName = context.flags.app;	
	let remote = context.flags.remote || appName;	
  	if (!appName) {
    	cli.error('Specify an app with --app');
    	return;
  	}		
  	let configDir = utils.getConfigDir(context);
	
  	if(!fs.existsSync(configDir)){
  		fs.mkdirSync(configDir);
  	}

  	let configFile = path.join(configDir, '.' + envName);

	if(fs.existsSync(configFile)) {
		cli.error("An environment with name '" + envName + "' already exists");
	} 	

  	let config = {
  		name: envName,
  		app: appName,
  		remote: remote,
  		config: {}
  	}

  	fs.writeFile(configFile, JSON.stringify(config, null, 4));
}


module.exports = {
	topic: 'env',
	command: 'add',
	description: 'add new environment for the app',
	args: [{name: 'name', description: 'name of the environment to create'}],
	flags: [{name: 'app', char: 'a', hasValue: true, description: 'name of app corresponding to this environment'},
			{name: 'remote', char: 'r', hasValue: true, 
			 description: 'name of git remote corresponding to this env, uses app name by default'},
			{name: 'dir', char: 'd', hasValue: true, description: 'path to the directory containing env config file'}],
	run: cli.command(co.wrap(add_env))	
};