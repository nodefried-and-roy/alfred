#!/usr/bin/env node

// START SECTION: SYSTEM

// START SUB: Constants
//
const config = require('./config.json');
const os = require('os');
const fs = require('fs');
const path = require('path');
const express = require('express');
const request = require("request");
const http = require("http");
//
// END SUB: Constants

// START SUB: Other Variables
//
var sys = require('util');
var exec = require('child_process').exec;
var cluster = require('cluster');
var systemOS = os.platform();
var prettySize = require('prettysize');
var prettyMs = require('pretty-ms');
var ffmpeg = require('fluent-ffmpeg');
var colors = require('colors');
//
// END SUB: Other Variables

// START SUB: Config Value Variables
//
bot_nickname = "Alfred";
bot_web_port = config.bot_web_port;
//
// END SUB: Config Value Variables

// END SECTION: SYSTEM

// START SECTION: FUNCTIONS

// START SUB: Write Operator Data
//
function operatorSave(operator) {
	fs.writeFile('operator', operator, function(err) {
	});
	console.log(timeStampLog()+'Wrote operator name and DNA to record...'.gray);
}
//
// END SUB: Write Operator Data

// START SUB: Timestamp Log
//
function timeStampLog() {
	var dateTime = require('node-datetime');
	var dt = dateTime.create();
	return dt.format('Y-m-d H:M:S').bold.green+'| ';
}
//
// END SUB: Timestamp Log

// START SUB: Timestamp Normal
//
function timeStamp() {
	var dateTime = require('node-datetime');
	var dt = dateTime.create();
	return dt.format('Y-m-d H:M:S');
}
//
// END SUB: Timestamp Normal

// START SUB: Ping
//
function ping(host) {
	var sys = require('util');
	var exec = require('child_process').exec;
	function puts(error, stdout, stderr) { 
		console.log(stdout);
		botConsole();
	}
	if (systemOS === "win32") {
		exec("ping -n 5 "+host, puts);
	} else {		
		exec("ping -c 5 "+host, puts);
	}
};
//
// END SUB: Ping

// START SUB: System Shell
// COMMENT: Super, super dangerous. You have been warned.
//
function shell(command) {
	var sys = require('util');
	var exec = require('child_process').exec;
	function puts(error, stdout, stderr) { 
		console.log(stdout);
		botConsole();
	}
	if (systemOS === "win32") {
		exec(command, puts);
	} else {		
		exec(command, puts);
	}
};
//
// END SUB: Sytem Shell

// START SUB: Prompt
//
function prompt(question, callback) {
	var stdin = process.stdin,
	stdout = process.stdout;

	stdin.resume();
	stdout.write(question);

	stdin.once('data', function (data) {
		callback(data.toString().trim());
	});
}
//
// END SUB: Prompt

// START SUB: Console Prompt
//
function botConsolePrompt() {
	return bot_nickname.toLowerCase().yellow+'@localhost'.yellow+' ##_\ '.trap.bold.cyan;
}
//
// END SUB: Console Prompt

// START SUB: Console
//
function botConsole() {
	prompt(timeStampLog()+botConsolePrompt(), function(botCommand) {
		var arguments = botCommand.split(/(\s+)/);
		if(arguments[0].toUpperCase() == "EXIT") {
				console.log(timeStampLog()+'Exiting back to console...');
				process.exit();
		} else if(arguments[0].toUpperCase() == "WEB") {
			if(arguments[2].toUpperCase() == "START") {
				console.log(timeStampLog()+'Starting the web server...');
				webServer('start');
			} else if (arguments[2].toUpperCase() == "STOP") {
				console.log(timeStampLog()+'Stopping the web server...');
				webServer('stop');
			}
		} else if(arguments[0].toUpperCase() == "PING") {
			console.log(timeStampLog()+'Pinging host, please wait...');
			let host = arguments[2];
			ping(host);
		} else if (arguments[0].toUpperCase() == "DOCS") {
			generateDocumentation();
		} else {
			shell(botCommand);
		}
	})
}
//
// END SUB: Console

// START SUB: Web Server
//
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
		var webBackendClose = 'http:\/\/localhost:'+bot_web_port+'/backend/close';
		request({
			url: webBackendClose,
			timeout: 5000
		}, function (error,response,body) {
			console.log(timeStampLog()+'Web server stopped successfully!'.red);
			botConsole();
		})
	}
}
//
// END SUB: Web Server

// START SUB: Documentation Generator
//
function generateDocumentation() {
	console.log(timeStampLog()+'Documentation generation beginning... please wait...'.yellow);
	fs.readFile('alfred.js', 'utf8', function (err,data) {
		if (err) {
			return console.log(timeStampLog()+err);
		}
		var result1 = data.replace(/#!\/usr\/bin\/env node/g, 
			'# Welcome to the '+bot_nickname+' Documentation');
		var result2 = result1.replace(/\/\/ START SECTION: /g, '## ');
		var result3 = result2.replace(/\/\/ END SECTION: (.+)/g, '');
		var result4 = result3.replace(/\/\/ START SUB: /g, '### ');
		var result5 = result4.replace(/\/\/ END SUB: (.+)/g, '');
		var result6 = result5.replace(/\/\/ COMMENT: /g,'');
		var result = result6.replace(/\/\//g, '```');
		fs.writeFile('DOCS.md', result, 'utf8', function (err) {
			if (err) return console.log(timeStampLog()+err);
		});
	});
	console.log(timeStampLog()+'Documentation generation done!'.bold.green);
	botConsole();
}
//
// END SUB: Main Generator

// END SECTION: FUNCTIONS

// START SECTION: RUNTIME

// START SUB: Initial Prompt and Console
// COMMENT: You must adhere to the comment policy in order for the documentation function to work.
// COMMENT: It's a pain in the ass but it works.
//
if (fs.existsSync('operator')) {
	var readStream = fs.createReadStream(path.join(__dirname, '/') + 'operator', 'utf8');
	let data = ''
	readStream.on('data', function(chunk) {
		data += chunk;
	}).on('end', function() {
		console.log(timeStampLog()+'Welcome back '+data+'!');
		botConsole();
	});
} else {

	prompt(timeStampLog()+'What is my operators name? ', function (var_operator_name) {
		operatorSave(var_operator_name);
		console.log(timeStampLog()+'Hello '+var_operator_name+', I am '+bot_nickname+'.');
		botConsole();
	});
}
//
// END SUB: Initial Prompt and Console

// END SECTION: RUNTIME
