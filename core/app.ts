import { app, BrowserWindow, ipcMain, globalShortcut, dialog, shell } from 'electron';
import { Interfaces } from './control/interfaces';
import * as ConfigurationLoader from './control/configuration-loader';
import * as CP from './control/quickcommand/cp';

let Windows: Interfaces.Windows = {};

const Configuration: Interfaces.Configuration = ConfigurationLoader.Load();

app.on('ready', (): void => {
    if(Windows.QuickCommand === undefined) {
        app.setAsDefaultProtocolClient('Commandist');

        const RetKey: string = Configuration['QuickCommand.v1.window.call.shortcutkey'] as string || 'CommandOrControl+Alt+Shift+S';

        globalShortcut.register(RetKey, (): void => {
            if(Windows.QuickCommand.isVisible()) HideQuickCommandWindow();
            else {
                Windows.QuickCommand.show();
                Windows.QuickCommand.webContents.send('show');

                const Screen: Electron.Screen = require('electron').screen;
                const FocusedDisplay: Electron.Display = Screen.getDisplayNearestPoint(Screen.getCursorScreenPoint());
                const MonitorPos: { x: number, y: number } = { x: FocusedDisplay.bounds.x, y: FocusedDisplay.bounds.y };
                Windows.QuickCommand.setPosition(MonitorPos.x + Math.ceil((FocusedDisplay.size.width / 2) - (656 / 2)), MonitorPos.y + Math.ceil(FocusedDisplay.size.height / 10 * 2.5));
            }
        });
        
        Initializer();

        if(globalShortcut.isRegistered(RetKey) === false) {
            const dialogWarning: number = dialog.showMessageBoxSync(Windows.QuickCommand, {
                type: 'warning',
                buttons: ['오류 제보 및 프로그램 종료', '무시'],
                defaultId: 0,
                cancelId: 1,
                title: 'The Commandist',
                message: 'QuickCommand 실행 단축키 등록에 실패했습니다.',
                detail: '프로그램을 다시 시작하면 문제를 해결할 수 있습니다.\n\n다시 시작해도 문제가 해결되지 않으면 \'오류 제보\' 버튼을 사용하거나 a@donghoonyoo.com 으로 오류에 관한 이메일을 보내십시오.'
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
    setTimeout((): void => Windows.QuickCommand.hide(), 100);
}

const Initializer = (): void => {
    Windows.QuickCommand = new BrowserWindow({
        width: 656,
        height: 76,
        titleBarStyle: 'hidden',
        frame: false,
        transparent: true,
        skipTaskbar: true,
        show: false,
        webPreferences: {
            nodeIntegration: true,
            webviewTag: true
        }
    });

    Windows.QuickCommand.loadFile('./views/quickcommand/index.html');

    Windows.QuickCommand.webContents.send('hide');

    const CommandProcessor: CP.CommandProcessor = new CP.CommandProcessor(Configuration, Windows.QuickCommand);

    ipcMain.on('Windows.QuickCommand.command', CommandProcessor.command);

    ipcMain.on('Windows.QuickCommand.execute', CommandProcessor.execute);

    ipcMain.on('Windows.QuickCommand.resize', (event, arg): void => {
        if(arg[0] && arg[1] && (Windows.QuickCommand.getSize()[0] != arg[0] || Windows.QuickCommand.getSize()[1] != arg[1]) && (Math.abs(Windows.QuickCommand.getSize()[0] - arg[0]) < 2 || Math.abs(Windows.QuickCommand.getSize()[1] - arg[1]) < 2)) Windows.QuickCommand.setSize(arg[0], arg[1] + 16);
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


    require(`./control/components/launcher`).init({ Configuration });
}