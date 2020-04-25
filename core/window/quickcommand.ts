import { BrowserWindow, ipcMain, Notification, globalShortcut, dialog, shell } from 'electron';
import { Control_ComponentManager } from '../control/component-manager';
import * as CP from '../quickcommand/command-processor';
import { Interfaces } from '../control/interfaces';
import * as path from 'path';

class Window_QuickCommand {
    private AppController: Interfaces.AppController;
    private Configuration: Interfaces.Configuration;
    private Language: Interfaces.Language;

    private ComponentManager: Control_ComponentManager;
    public Window: BrowserWindow;

    constructor(AppController: Interfaces.AppController, Configuration: Interfaces.Configuration, Language: Interfaces.Language, ComponentManager: Control_ComponentManager) {
        this.AppController = AppController;
        this.Configuration = Configuration;
        this.Language = Language;
        this.ComponentManager = ComponentManager;

        this.Window = new BrowserWindow({
            width: 688,
            height: 0,
            titleBarStyle: 'hidden',
            frame: false,
            show: false,
            transparent: true,
            skipTaskbar: true,
            minimizable: false,
            maximizable: false,
            closable: false,
            fullscreen: false,
            title: 'QuickCommandUI',
            enableLargerThanScreen: false,
            hasShadow: false,
            webPreferences: {
                //devTools: false,
                zoomFactor: 1.0,
                nodeIntegration: true,
                webviewTag: true
            }
        });
        
        this.Window.loadFile(path.join(__dirname, '..', 'views', 'quickcommand', 'index.html'));

        this.RepositionQuickCommandWindow();

        const CommandProcessor: CP.CommandProcessor = new CP.CommandProcessor(this.Configuration, Language, this.Window, this.ComponentManager);

        setInterval((): void => {
            if(this.Window.isVisible()) {
                const Screen: Electron.Screen = require('electron').screen;
                const ScreenSize: Electron.Size = Screen.getDisplayNearestPoint(Screen.getCursorScreenPoint()).size;
                this.Window.webContents.send('MaxWindowSearchResultsHeight', Math.ceil(ScreenSize.height - (ScreenSize.height / 10 * 2.5)) - 76 - 160);
            }
        }, 500);

        // require(`../quickcommand/components/launcher`).init({ Configuration: this.Configuration, QuickCommand: this.Window }, (error: Error, data: { [type: string]: any }) => {
        //     Object.keys(data).forEach((Key) => this.Window.webContents.send(Key, data[Key]));
        // });

        const RetKey: string = (this.Configuration['QuickCommand.v1.window.call.shortcutkey.definition1'] as string || 'Shift') + '+' + (this.Configuration['QuickCommand.v1.window.call.shortcutkey.definition2'] as string || 'Space');

        globalShortcut.register(RetKey, (): void => this.Restore());

        if(globalShortcut.isRegistered(RetKey) === false) {
            const dialogWarning: number = dialog.showMessageBoxSync(this.Window, {
                type: 'warning',
                buttons: [ this.Language['Commandist.v1.control.QuickCommand.v1.globalShortcut.warning.dialog.button0'], this.Language['Commandist.v1.control.QuickCommand.v1.globalShortcut.warning.dialog.button1'] ],
                defaultId: 0,
                cancelId: 1,
                title: 'The Commandist',
                message: this.Language['Commandist.v1.control.QuickCommand.v1.globalShortcut.warning.dialog.message'],
                detail: this.Language['Commandist.v1.control.QuickCommand.v1.globalShortcut.warning.dialog.detail']
            });
            if(dialogWarning === 0) shell.openExternal('https://github.com/donghoony1/Commandist/issues');
        }

        if(this.Configuration['Commandist.v1.notification.run.eanbled'] === true) new Notification({
            title: this.Language['Commandist.v1.common.notification.event.ready.title'],
            body: this.Language['Commandist.v1.common.notification.event.ready.body']
        }).show();

        ipcMain.on('Windows.QuickCommand.command', CommandProcessor.command);

        ipcMain.on('Windows.QuickCommand.execute', (event, args) => CommandProcessor.execute(this.AppController, args, (error: Error, data: string) => {
            switch(data) {
                
            }
        }));

        ipcMain.on('Windows.QuickCommand.resize', (event, args): void => {
            const WindowSize: Array<number> = this.Window.getSize();
            if(args[0] && args[1] && ([0] != args[0] || WindowSize[1] != args[1]) && (Math.abs(WindowSize[0] - args[0]) < 2 || Math.abs(WindowSize[1] - args[1]) < 2)) this.Window.setSize(688, args[1] + 48);
        });

        ipcMain.on('Windows.QuickCommand.hide', (): void => {
            setTimeout((): void => this.Window.hide(), 100);
        });

        ipcMain.on('Windows.QuickCommand.UIReady', (): void => {
            this.Window.webContents.send('SetAppearance', {
                Logo: this.Configuration['QuickCommand.v1.window.appearance.logo'],
                State: this.Configuration['QuickCommand.v1.window.appearance.state']
            });
        });
    }

    HideQuickCommandWindow = (): void => {
        this.Window.webContents.send('hide');
        setTimeout((): void => this.Window.hide(), 70);
    }

    RepositionQuickCommandWindow = (): void => {
        const Screen: Electron.Screen = require('electron').screen;
        const FocusedDisplay: Electron.Display = Screen.getDisplayNearestPoint(Screen.getCursorScreenPoint());
        const MonitorPos: { x: number, y: number } = { x: FocusedDisplay.bounds.x, y: FocusedDisplay.bounds.y };
        const x: number = MonitorPos.x + Math.ceil((FocusedDisplay.size.width / 2) - (656 / 2));
        const y: number = MonitorPos.y + Math.ceil(FocusedDisplay.size.height / 10 * 2.5);
        this.Window.setPosition(x, y);
        const WindowPos: Array<number> = this.Window.getPosition();
        if(WindowPos[0] !== x || WindowPos[1] !== y) this.Window.setPosition(x, y);
    }

    Restore = (): void => {
        if(this.Window.isVisible()) this.HideQuickCommandWindow();
        else {
            this.RepositionQuickCommandWindow();
            this.Window.webContents.send('show');
            this.Window.show();
        }
    }

    Blur = (): void => {
        if(this.Window.isVisible()) this.HideQuickCommandWindow();
    }
}

export { Window_QuickCommand };