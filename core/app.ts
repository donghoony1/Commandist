import { app, BrowserWindow, ipcMain, globalShortcut } from 'electron';
import { Interfaces } from './control/interfaces';
import * as ConfigurationLoader from './control/configuration-loader';
import * as CP from './control/quickcommand/cp';

let Windows: Interfaces.Windows = {};

const Configuration: Interfaces.Configuration = ConfigurationLoader.Load();

app.on('ready', (): void => {
    if(Windows.QuickCommand === undefined) {
        app.setAsDefaultProtocolClient('Commandist');

        const ret = globalShortcut.register('CommandOrControl+Alt+Shift+S', (): void => {
            Windows.QuickCommand.show();
            Windows.QuickCommand.webContents.send('show');
        });
        
        Initializer();
    }
});

app.on('browser-window-blur', () => {
    if(Windows.QuickCommand.isVisible()) {
        Windows.QuickCommand.hide();
        Windows.QuickCommand.webContents.send('hide');
    }
});

const Initializer = (): void => {
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

    Windows.QuickCommand.loadFile('./views/quickcommand/index.html');

    const screen = require('electron').screen;
    const screenSize = screen.getDisplayNearestPoint(screen.getCursorScreenPoint()).size;
    Windows.QuickCommand.setPosition(Math.ceil((screenSize.width / 2) - (656 / 2)), Math.ceil(screenSize.height / 10 * 2.5));

    const CommandProcessor = new CP.CommandProcessor(Configuration, Windows.QuickCommand);
    ipcMain.on('command', CommandProcessor.command);

    ipcMain.on('resize', (event, arg): void => {
        if(arg[0] && arg[1] && (Windows.QuickCommand.getSize()[0] != arg[0] || Windows.QuickCommand.getSize()[1] != arg[1]) && (Math.abs(Windows.QuickCommand.getSize()[0] - arg[0]) < 2 || Math.abs(Windows.QuickCommand.getSize()[1] - arg[1]) < 2)) Windows.QuickCommand.setSize(arg[0], arg[1] + 16);
    });

    ipcMain.on('hide', (): void => Windows.QuickCommand.hide());

    setInterval((): void => {
        if(Windows.QuickCommand && Windows.QuickCommand.isVisible()) {
            const screen = require('electron').screen;
            const screenSize = screen.getDisplayNearestPoint(screen.getCursorScreenPoint()).size;
            Windows.QuickCommand.webContents.send('MaxWindowSearchResultsHeight', Math.ceil(screenSize.height - (screenSize.height / 10 * 2.5)) - 76 - 160);
        }
    }, 500);

    require(`./control/components/launcher`).init({ Configuration });
}