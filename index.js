#!/usr/bin/env node
// Bot Name
var botName = "Alfred";

// Web Server Port
var botWebPort = 5000;

// Colors
var colors = require('colors');

// Color Examples
//console.log('hello'.green); // outputs green text 
//console.log('i like cake and pies'.underline.red) // outputs red underlined text 
//console.log('inverse the color'.inverse); // inverses the color 
//console.log('OMG Rainbows!'.rainbow); // rainbow 
//console.log('Run the trap'.trap); // Drops the bass 

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
	return '##_\ '.trap.bold.cyan;
}

// Console
function botConsole() {
	prompt(timeStampLog()+botConsolePrompt(), function(botCommand) {
		switch(botCommand.toUpperCase()) {
			case "EXIT":
				console.log(timeStampLog()+'Exiting back to console...');
				process.exit();
				break;
			case "WEB START":
				console.log(timeStampLog()+'Starting the web server...');
				webServer();
				break;
			default:
				console.log(timeStampLog()+'Not a recognized command...');
				botConsole();
				break;
		}
	})
}

// Web Server
function webServer() {
	const express = require('express');
	const web = express();
	web.get('/', (req,res) => {
		res.send('Web server started successfully!');
	});
	web.listen(botWebPort);
	console.log(timeStampLog()+'Web server started successfully on port '+botWebPort+'!'.bold.green);
	botConsole();
}

// Start Runtime
prompt(timeStampLog()+'Please enter your name so I know what to call you? '+botConsolePrompt(), function (var_operator_name) {
    prompt(timeStampLog()+'Hello, '+var_operator_name+' I am '+botName+'. Do you want to hear a joke? '+botConsolePrompt(), function (var_question_result) {
	if (var_question_result.toUpperCase() == "YES" || var_question_result.toUpperCase() == "OK" || var_question_result.toUpperCase() == "SURE" ) {
		prompt(timeStampLog()+'OH! What do you call a bot with no legs '+var_operator_name+'? '+botConsolePrompt, function (var_joke_answer) {
			console.log(timeStampLog()+"A Python bot! Haha! Get it? Because Python's don't have legs.");		
			botConsole();
		})
	} else {
		botConsole();
	}
    })
});
// End Runtime
