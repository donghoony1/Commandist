import { app, BrowserWindow, ipcMain } from 'electron';
import * as Interfaces from './core/common/interfaces';
import * as ConfigurationLoader from './core/common/configuration-loader';
import * as CP from './core/common/quickcommand/cp';

let Windows: Interfaces.Windows = {};

let Configuration: Interfaces.Configuration = ConfigurationLoader.Load();

app.on('ready', () => {
    if(Windows.QuickCommand === undefined) {
        app.setAsDefaultProtocolClient('Commandist');
        
        Initializer();
    }
});

const Initializer = () => {
    Windows.QuickCommand = new BrowserWindow({
        width: 656,
        height: 76,
        frame: false,
        titleBarStyle: 'hidden',
        transparent: true,
        skipTaskbar: true,
        webPreferences: {
            nodeIntegration: true,
            webviewTag: true
        }
    });

    Windows.QuickCommand.loadFile('./core/views/quickcommand/index.html');

    const screen = require('electron').screen;
    const screenSize = screen.getDisplayNearestPoint(screen.getCursorScreenPoint()).size;
    Windows.QuickCommand.setPosition(Math.ceil((screenSize.width / 2) - (656 / 2)), Math.ceil(screenSize.height / 10 * 2.5));

    const CommandProcessor = new CP.CommandProcessor(Configuration, Windows.QuickCommand);
    ipcMain.on('command', CommandProcessor.command);
}