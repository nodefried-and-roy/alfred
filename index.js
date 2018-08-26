#!/usr/bin/env node

// Misc Basic Variables
const config = require('./config.json');
const os = require('os');
const fs = require('fs');
const path = require('path');
const express = require('express');
const request = require("request");
const http = require("http");

var sys = require('util');
var exec = require('child_process').exec;
var cluster = require('cluster');
var systemOS = os.platform();
var prettySize = require('prettysize');
var prettyMs = require('pretty-ms');
var ffmpeg = require('fluent-ffmpeg');


// Colors
var colors = require('colors');

// Timestamp Log
function timeStampLog() {
	var dateTime = require('node-datetime');
	var dt = dateTime.create();
	return dt.format('Y-m-d H:M:S').bold.green+'| ';
}

// Timestamp Normal
function timeStamp() {
	var dateTime = require('node-datetime');
	var dt = dateTime.create();
	return dt.format('Y-m-d H:M:S');
}

// Ping
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

// Prompt
function prompt(question, callback) {
	var stdin = process.stdin,
	stdout = process.stdout;

	stdin.resume();
	stdout.write(question);

	stdin.once('data', function (data) {
		callback(data.toString().trim());
	});
}

// Console Prompt
function botConsolePrompt() {
	return bot_nickname.toLowerCase().yellow+'@localhost'.yellow+' ##_\ '.trap.bold.cyan;
}

// Console
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

// Web Server
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

// Start Runtime
prompt(timeStampLog()+'Please enter your name so I know what to call you? ', function (var_operator_name) {
    prompt(timeStampLog()+'Hello, '+var_operator_name+' I am '+bot_nickname+'. Do you want to hear a joke? ', function (var_question_result) {
	if (var_question_result.toUpperCase() == "YES" || var_question_result.toUpperCase() == "OK" || var_question_result.toUpperCase() == "SURE" ) {
		prompt(timeStampLog()+'OH! What do you call a bot with no legs '+var_operator_name+'? ', function (var_joke_answer) {
			console.log(timeStampLog()+"A Python bot! Haha! Get it? Because Python's don't have legs.");		
			botConsole();
		})
	} else {
		botConsole();
	}
    })
});
// End Runtime
