"use strict";
let findParentDir = require('find-parent-dir');
let cli = require('heroku-cli-util');
let fs = require('fs');
let path = require('path');
let _ = require('lodash');
require('shelljs/global');


module.exports.getConfigDir = function getConfigDir(context){
  	let dir = context.flags.dir;  	
  	if(!dir){
		try{
			dir = findParentDir.sync(process.cwd(), '.envconfig');
		}catch(err){
			try {
				dir = findParentDir.sync(process.cwd(), '.git');			
			}catch(err){
				cli.error('Specify the directory containing env config files with --dir');
			}
		}
  	}  	
  	return path.join(dir, '.envconfig');
};

module.exports.getRemoteFromGitConfig = function(){
	return exec("git config heroku.remote").output.trim();
};

module.exports.readJSONFile = function(dir, file){
	return new Promise(function(resolve, reject){
		fs.readFile(path.join(dir, file), 'utf8', function(err, data){
			if(err)
				reject(err);
			else{
				resolve(JSON.parse(data));
			}
		});
	});
};

module.exports.getCurrentEnvironment = function(envDir){
	let remote = this.getRemoteFromGitConfig();
	var that = this;

	return new Promise(function(resolve, reject){
		that.getEnvironments(envDir).then(function(envDict){						
			_.each(envDict, function(env){				
				if(env.remote === remote)
					resolve(env);
			});
			reject(null);
		}, function(error){
			reject(error);
		});
	});
};

module.exports.getEnvironments = function getEnvironments(envDir){
	var envDict = {};
	var that = this;

	return new Promise(function(resolve, reject){
		fs.readdir(envDir, function(err, files){
			Promise.all(files.map(that.readJSONFile.bind(null, envDir))).then(function(envs){
				var envDict = {};							
				envs.forEach(function(env){
					envDict[env.name] = env;
				});				
				resolve(envDict);
			}, function(error){
				reject(error);
			});
		});

	});
};

module.exports.getAppEnvMap = function getAppEnvMap(envDict){
	var appDict = {};
	envDict.forEach(function(env, name){
		appDict[env.app] = name;
	});
	return appDict;
};