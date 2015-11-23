'use strict';

exports.topic = {
  name: 'env',
  // this is the help text that shows up under `heroku help`
  description: 'Manage different environments for an app like staging/qa/production'
};

exports.commands = [
  require('./commands/add.js'),
  require('./commands/remove.js'),
  require('./commands/info.js'),
  require('./commands/switch.js')
];