#!/usr/bin/env node

//
// START SECTION: SYSTEM
//

// START: Constants
const config = require('./config.json');
const os = require('os');
const fs = require('fs');
const path = require('path');
const express = require('express');
const request = require("request");
const http = require("http");
// END: Constants

// START: Other Variables
var sys = require('util');
var exec = require('child_process').exec;
var cluster = require('cluster');
var systemOS = os.platform();
var prettySize = require('prettysize');
var prettyMs = require('pretty-ms');
var ffmpeg = require('fluent-ffmpeg');
// END: Other Variables


// START: Config Value Variables
bot_nickname = "Alfred";
bot_web_port = config.bot_web_port;
// END: Config Value Variables

// START: Color Variables
var colors = require('colors');
// END: Color Variables

//
// END SECTION: SYSTEM
//

//
// START SECTION: FUNCTIONS
//

// START: Write Operator Data
function operatorSave() {
	fs.writeFile('/tmp/test', 'Hey there!', function(err) {
		if(err) {
	    		console.log(timeStampLog()+err);
		}
		console.log(timeStampLog()+'The file was saved!');
	});
}
// END: Write Operator Data

// START: Timestamp Log
function timeStampLog() {
	var dateTime = require('node-datetime');
	var dt = dateTime.create();
	return dt.format('Y-m-d H:M:S').bold.green+'| ';
}
// END: Timestamp Log

// START: Timestamp Normal
function timeStamp() {
	var dateTime = require('node-datetime');
	var dt = dateTime.create();
	return dt.format('Y-m-d H:M:S');
}
// END: Timestamp Normal

// START: Ping
function ping(host) {
	var sys = require('util');
	var exec = require('child_process').exec;
	function puts(error, stdout, stderr) { 
		console.log(timeStampLog()+'Results Below:');
		console.log(stdout);
		botConsole();
	}
	if (systemOS === "win32") {
		exec("ping -n 5 "+host, puts);
	} else {		
		exec("ping -c 5 "+host, puts);
	}
};
// END: Ping

// START: Prompt
function prompt(question, callback) {
	var stdin = process.stdin,
	stdout = process.stdout;

	stdin.resume();
	stdout.write(question);

	stdin.once('data', function (data) {
		callback(data.toString().trim());
	});
}
// END: Prompt

// START: Console Prompt
function botConsolePrompt() {
	return bot_nickname.toLowerCase().yellow+'@localhost'.yellow+' ##_\ '.trap.bold.cyan;
}
// END: Console Prompt

// START: Console
function botConsole() {
	prompt(timeStampLog()+botConsolePrompt(), function(botCommand) {
		var arguments = botCommand.split(/(\s+)/);
		if(arguments[0].toUpperCase() == "EXIT") {
				console.log(timeStampLog()+'Exiting back to console...');
				process.exit();
		} 
		if(arguments[0].toUpperCase() == "WEB") {
			if(arguments[2].toUpperCase() == "START") {
				console.log(timeStampLog()+'Starting the web server...');
				webServer('start');
			} else if (arguments[2].toUpperCase() == "STOP") {
				console.log(timeStampLog()+'Stopping the web server...');
				webServer('stop');
			}
		} 
		if(arguments[0].toUpperCase() == "PING") {
				console.log(timeStampLog()+'Pinging host, please wait...');
				let host = arguments[2];
				ping(host);
		}
		if(!arguments[0]) {
				console.log(timeStampLog()+'Not a recognized command...');
				botConsole();
		}
	})
}
// END: Console

// START: Web Server
function webServer(action) {
	const web = express();
	if (action.toUpperCase() == "START") {
		const server = web.listen(bot_web_port);
		web.get('/', (req,res) => {
			res.send('Web server started successfully!');
		});
		web.get('/backend/close', (req,res) => {
			server.close();
		});
		console.log(timeStampLog()+'Web server started successfully!'.green);
		botConsole();
	} else if(action.toUpperCase() == "STOP") {
		var webBackendClose = 'http://localhost:'+bot_web_port+'/backend/close';
		request({
			url: webBackendClose,
			timeout: 5000
		}, function (error,response,body) {
			console.log(timeStampLog()+'Web server stopped successfully!'.red);
			botConsole();
		})
	}
}
// END: Web Server


//
// END SECTION: FUNCTIONS
//


//
// START SECTION: RUNTIME
//

// START: Initial Prompt and Console
prompt(timeStampLog()+'Please enter your name so I know what to call you? ', function (var_operator_name) {
    prompt(timeStampLog()+'Hello, '+var_operator_name+' I am '+bot_nickname+'. Do you want to hear a joke? ', function (var_question_result) {
	if (var_question_result.toUpperCase() == "YES" || var_question_result.toUpperCase() == "OK" || var_question_result.toUpperCase() == "SURE" ) {
		prompt(timeStampLog()+'OH! What do you call a bot with no legs '+var_operator_name+'? ', function (var_joke_answer) {
			console.log(timeStampLog()+"A Python bot! Haha! Get it? Because Python's don't have legs.");		
			operatorSave();
			botConsole();
		})
	} else {
		botConsole();
	}
    })
});
// END: Initial Prompt and Console

//
// END SECTION: RUNTIME
//
