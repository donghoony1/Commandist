import { app, BrowserWindow, ipcMain, globalShortcut, dialog, shell } from 'electron';
import { Interfaces } from './control/interfaces';
import * as ConfigurationLoader from './control/configuration-loader';
import * as LanguageLoader from './control/language-loader';
import * as CP from './control/quickcommand/command-processor';

let Windows: Interfaces.Windows = {};

const Configuration: Interfaces.Configuration = ConfigurationLoader.Load();
const Language: Interfaces.Language = LanguageLoader.Load(Configuration['Commandist.v1.Language'] as Interfaces.LanguageTypeList);

app.on('ready', (): void => {
    if(Windows.QuickCommand === undefined) {
        Initializer();

        app.setAsDefaultProtocolClient('Commandist');
        app.setAppUserModelId(process.execPath);

        const RetKey: string = Configuration['QuickCommand.v1.window.call.shortcutkey'] as string || 'CommandOrControl+Alt+Shift+S';

        globalShortcut.register(RetKey, (): void => {
            if(Windows.QuickCommand.isVisible()) HideQuickCommandWindow();
            else {
                RepositionQuickCommandWindow();

                Windows.QuickCommand.webContents.send('show');
                Windows.QuickCommand.show();
            }
        });

        if(globalShortcut.isRegistered(RetKey) === false) {
            const dialogWarning: number = dialog.showMessageBoxSync(Windows.QuickCommand, {
                type: 'warning',
                buttons: [ Language['Commandist.v1.control.QuickCommand.v1.globalShortcut.warning.dialog.button0'], Language['Commandist.v1.control.QuickCommand.v1.globalShortcut.warning.dialog.button1'] ],
                defaultId: 0,
                cancelId: 1,
                title: 'The Commandist',
                message: Language['Commandist.v1.control.QuickCommand.v1.globalShortcut.warning.dialog.message'],
                detail: Language['Commandist.v1.control.QuickCommand.v1.globalShortcut.warning.dialog.detail']
            });
            if(dialogWarning === 0) shell.openExternal('https://github.com/donghoony1/Commandist/issues');
        }
    }
});

app.on('browser-window-blur', () => {
    if(Windows.QuickCommand.isVisible()) HideQuickCommandWindow();
});

const HideQuickCommandWindow = (): void => {
    Windows.QuickCommand.webContents.send('hide');
    setTimeout((): void => Windows.QuickCommand.hide(), 70);
}

const RepositionQuickCommandWindow = (): void => {
    const Screen: Electron.Screen = require('electron').screen;
    const FocusedDisplay: Electron.Display = Screen.getDisplayNearestPoint(Screen.getCursorScreenPoint());
    const MonitorPos: { x: number, y: number } = { x: FocusedDisplay.bounds.x, y: FocusedDisplay.bounds.y };
    const x: number = MonitorPos.x + Math.ceil((FocusedDisplay.size.width / 2) - (656 / 2));
    const y: number = MonitorPos.y + Math.ceil(FocusedDisplay.size.height / 10 * 2.5);
    Windows.QuickCommand.setPosition(x, y);
    const WindowPos: Array<number> = Windows.QuickCommand.getPosition();
    if(WindowPos[0] !== x || WindowPos[1] !== y) Windows.QuickCommand.setPosition(x, y);
}

const Initializer = (): void => {
    Windows.QuickCommand = new BrowserWindow({
        width: 672,
        height: 92,
        titleBarStyle: 'hidden',
        frame: false,
        show: false,
        transparent: true,
        skipTaskbar: true,
        webPreferences: {
            nodeIntegration: true,
            webviewTag: true
        }
    });

    Windows.QuickCommand.loadFile('./views/quickcommand/index.html');

    RepositionQuickCommandWindow();

    const CommandProcessor: CP.CommandProcessor = new CP.CommandProcessor(Configuration, Language, Windows.QuickCommand);

    ipcMain.on('Windows.QuickCommand.command', CommandProcessor.command);

    ipcMain.on('Windows.QuickCommand.execute', CommandProcessor.execute);

    ipcMain.on('Windows.QuickCommand.resize', (event, arg): void => {
        if(arg[0] && arg[1] && (Windows.QuickCommand.getSize()[0] != arg[0] || Windows.QuickCommand.getSize()[1] != arg[1]) && (Math.abs(Windows.QuickCommand.getSize()[0] - arg[0]) < 2 || Math.abs(Windows.QuickCommand.getSize()[1] - arg[1]) < 2)) Windows.QuickCommand.setSize(672, arg[1] + 32);
    });

    ipcMain.on('Windows.QuickCommand.hide', (): void => {
        setTimeout((): void => Windows.QuickCommand.hide(), 100);
    });

    setInterval((): void => {
        if(Windows.QuickCommand && Windows.QuickCommand.isVisible()) {
            const Screen: Electron.Screen = require('electron').screen;
            const ScreenSize: Electron.Size = Screen.getDisplayNearestPoint(Screen.getCursorScreenPoint()).size;
            Windows.QuickCommand.webContents.send('MaxWindowSearchResultsHeight', Math.ceil(ScreenSize.height - (ScreenSize.height / 10 * 2.5)) - 76 - 160);
        }
    }, 500);


    require(`./control/quickcommand/components/launcher`).init({ Configuration, Language });
}