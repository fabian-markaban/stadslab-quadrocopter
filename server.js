#!/usr/bin/env node

var arDrone = require('ardrone');
var connect = require('connect');
var io      = require('socket.io');
var fs      = require('fs');

// add server 
var server = connect.createServer(connect.static(__dirname + '/public'));
server.listen(8000);

// open socket
var socket = io.listen(server);
socket.on('connection', function(client) 
{
    // listen for messages from client(s)
    client.on('message', function(message) 
    {
        if (message.charAt(0) == '{') {
            var data = JSON.parse(message)
            for (key in data) {
                if (data.hasOwnProperty(key)) {
                    arDrone[key] = 0.4 * data[key];
                }
            }
        } else {
            var parts   = message.split(/\s/);
            var command = parts[0];
            var params  = parts.slice(1);
            
            for (var i = 0, l = params.length; i < l; i++) {
                params[i] = parseFloat(params[i]);
            }
            
            if ('function' == typeof arDrone[command]) {
                console.log('Command sent: "' + command + '" params: [' + params.join(', ') + ']');
                arDrone[command].apply(arDrone, params);
            } else {
                console.log('Unknown command: ' + command);
            }
        }
    });
});