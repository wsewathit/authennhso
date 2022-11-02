'use strict';
const {
    app,
    BrowserWindow,
    Menu,
    remote,
    dialog
} = require('electron');
const url = require('url');
const path = require('path');
const fs = require('fs');
const execSeries = require('exec-series');
let win;
let addWindow;

function createWindow(argument) {
    win = new BrowserWindow({
        alwaysOnTop: true,
        width: 470,
        height: 360,
         webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    });
    win.loadURL(`file://${__dirname}/index.html`);
    win.on('closed', function() {
        app.quit();
    });

     const mainMenu = Menu.buildFromTemplate(mainMenutemplate);
    Menu.setApplicationMenu(mainMenu);

}
app.on('ready', createWindow);

const mainMenutemplate = [{
    label: 'FILE',
    submenu: [{
        label: "ออกจากระบบ",
        accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
        click() {
            app.quit();
        }
    }]
}];
process.env.NODE_ENV = 'develop';
// If mac , add empty object to menu
if (process.platform == 'production') {
    mainMenutemplate.unshift({});
}
// Add developer tools item if not in prod
if (process.env.NODE_ENV !== 'production') {
    mainMenutemplate.push({
        label: "Developer Tools",
        submenu: [{
            label: 'Toggle Devtools',
            accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
            click(item, focusedWindow) {
                focusedWindow.toggleDevTools();
            }
        }, {
            role: 'reload'
        }]
    });
}

