'use strict';

const electron = require('electron');
const app = require('app');
const BrowserWindow = require('browser-window');
const notifier = require('node-notifier');
var ipc = electron.ipcMain;
const fs = require('fs');
var checkConfig = function(file) {
    let config = false;
    try {
        var err = fs.accessSync(file);
        config = fs.readFileSync(file, 'utf-8');
    } catch (err) {
        console.log(err)
    }
    return config;
};
var createConfig = function(data) {
    fs.writeFile('config.txt', data, (err) => {
        if (err) throw err;
    });
}

var notification = function(message){
	notifier.notify({
	  'title': 'System Info',
	  'message': message,
	  sound: true,
	});
}


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow = null;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform != 'darwin') {
        app.quit();
    }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function() {

    var openMainWindow = function(url) {
        mainWindow = new BrowserWindow({
            "node-integration": false
        });
        mainWindow.loadURL(url);
        mainWindow.maximize();

        mainWindow.on('closed', function() {
            mainWindow = null;
        });
    }
    let url = checkConfig('config.txt');
    if (!url) {
        var settingWindow = new BrowserWindow({width:400, height: 250});
        settingWindow.loadURL('file://' + __dirname + '/setting.html');
        ipc.on('sendUrl', function(event, data) {
            event.preventDefault();
			createConfig(data.url);
			notification('The configuration is saved! :)')
            openMainWindow(data.url);
            settingWindow.close();
        })
    } else {
        openMainWindow(url);
    }

});
