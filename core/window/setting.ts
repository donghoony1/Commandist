
import * as ConfigurationManager from '../control/configuration-manager';
import { Interfaces } from '../control/interfaces';
import { BrowserWindow, ipcMain, dialog } from 'electron';
import { UI_Setting } from '../ui/setting';
import * as path from 'path';

class Window_Setting {
    private AppController: Interfaces.AppController;
    private Configuration: Interfaces.Configuration;
    private Language: Interfaces.Language;

    public Window: BrowserWindow;

    constructor(AppController: Interfaces.AppController, Configuration: Interfaces.Configuration, Language: Interfaces.Language) {
        this.AppController = AppController;
        this.Configuration = Configuration;
        this.Language = Language;

        const Screen: Electron.Screen = require('electron').screen;
        const FocusedDisplay: Electron.Display = Screen.getDisplayNearestPoint(Screen.getCursorScreenPoint());
        const MonitorPos: { x: number, y: number } = { x: FocusedDisplay.bounds.x, y: FocusedDisplay.bounds.y };
        const width: number = Math.floor(FocusedDisplay.size.width * 0.8);
        const height: number = Math.floor(FocusedDisplay.size.height * 0.8);
        const x: number = Math.floor(MonitorPos.x + FocusedDisplay.size.width / 2 - width / 2);
        const y: number = Math.floor(MonitorPos.y + FocusedDisplay.size.height / 2 - height / 2);

        this.Window = new BrowserWindow({
            title: 'SettingUI',
            show: false,
            frame: false,
            webPreferences: {
                zoomFactor: 1.0,
                nodeIntegration: true
            },
            width, height, x, y
        });

        this.Window.setSize(width, height);
        this.Window.setPosition(x, y);

        this.Window.loadFile(path.join(__dirname, '..', 'views', 'setting', 'index.html'));

        const SettingUIData: UI_Setting = new UI_Setting(this.Language);

        ipcMain.on('Windows.Setting.load', (event, args): void => {
            this.Window.webContents.send('data', { UI: SettingUIData.get(), Configuration: this.Configuration });
        });

        ipcMain.on('Windows.Setting.modify', (event, args): void => ConfigurationManager.Modify(args.Type, args.ID, args.Value));

        ipcMain.on('Windows.Setting.restart', (event, args): void => {
            const DialogUserSelection: number = dialog.showMessageBoxSync(this.Window, {
                type: 'warning',
                buttons: [ this.Language['Commandist.v1.window.Setting.v1.restart.warning.dialog.button0'], this.Language['Commandist.v1.window.Setting.v1.restart.warning.dialog.button1'] ],
                defaultId: 0,
                cancelId: 1,
                title: 'The Commandist',
                message: this.Language['Commandist.v1.window.Setting.v1.restart.warning.dialog.message'],
                detail: this.Language['Commandist.v1.window.Setting.v1.restart.warning.dialog.detail']
            });

            switch(DialogUserSelection) {
                case 0: 
                    this.AppController.restart();
                    break;
            }
        });
    }
}

export { Window_Setting };