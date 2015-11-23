'use strict';

let cli = require('heroku-cli-util');

let fs = require('fs');

let path = require('path');

let co  = require('co');

let utils = require('./utils.js');


function* remove_env(context, heroku) {
	let envName = context.args.name;	
  	let configDir = utils.getConfigDir(context);
	
  	let configFile = path.join(configDir, '.' + envName);

	if(fs.existsSync(configFile)) {
		fs.unlinkSync(configFile);
	} 	
}


module.exports = {
	topic: 'env',
	command: 'remove',
	description: 'remove specified environment for the app',
	args: [{name: 'name', description: 'name of the environment to create'}],
	flags: [{name: 'dir', char: 'd', hasValue: true, description: 'path to the directory containing env config file'}],
	run: cli.command(co.wrap(remove_env))	
};