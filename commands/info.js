'use strict';

let cli = require('heroku-cli-util');

let fs = require('fs');

let path = require('path');

let co  = require('co');

let utils = require('./utils.js');


function* info(context, heroku) {
  	let configDir = utils.getConfigDir(context);  	
  	utils.getCurrentEnvironment(configDir).then(function(env){
		console.log("Current Environment: "  + env.name);
  		heroku.apps(env.app).info(function(err, info){
  			if(err)	{
  				cli.error(err);
  				return;
  			}
			cli.debug("---- Application Info ----");
			cli.debug(info);			
	  		heroku.apps(env.app).configVars().info(function(err, info){
	  			if(err)	{
	  				cli.error(err);
	  				return;
	  			}
				cli.debug("---- Configuration Variables ----");	  				
				console.log(info);
	  		});			
  		});  	
  	}, function(error){
  		cli.error(error);
  	});
}


module.exports = {
	topic: 'env',
	command: 'info',
	description: 'Info for the current environment',
	needsApp: true,
  	needsAuth: true,
	flags: [{name: 'dir', char: 'd', hasValue: true, description: 'path to the directory containing env config file'}],
	run: cli.command(co.wrap(info))	
};