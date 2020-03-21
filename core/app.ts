import { Control_WorkerManager } from './control/worker-manager';
import { Window_QuickCommand } from './window/quickcommand';
import * as LanguageLoader from './control/language-loader';
import { app, globalShortcut, shell } from 'electron';
import { Window_Setting } from './window/setting';
import { Interfaces } from './control/interfaces';
import * as querystring from 'querystring';
import * as url from 'url';

process.env.build = /Commandist( \((Beta|Developer Preview)\))?\.exe$/.test(process.argv[0]) ? 'application' : 'electron'

const Configuration: Interfaces.Configuration = require(`${ process.env.build === 'application' ? '../../app.asar.unpacked/core' : '.' }/control/configuration-manager`).Load();
const Language: Interfaces.Language = LanguageLoader.Load(Configuration['Commandist.v1.Language'] as Interfaces.LanguageTypeList);

const uri: Interfaces.ProtocolURI = process.argv.length === 2 && url.parse(process.argv[1]).query !== undefined ? querystring.parse(url.parse(process.argv[1]).query!) : {};

const Windows: Interfaces.Windows = {};

if(uri.control === undefined || uri.control !== 'IgnorePreventingDuplicatedProcess') {
    const GotLock = app.requestSingleInstanceLock();

    if(GotLock) {
        app.on('second-instance', () => {
            if(Windows.QuickCommand !== undefined) Windows.QuickCommand!.Restore();
        })
    } else process.exit();
}

app.on('ready', (): void => {
    app.setAsDefaultProtocolClient('Commandist');
    app.setAppUserModelId(process.execPath);

    const WorkerManager = new Control_WorkerManager();

    Windows.QuickCommand = new Window_QuickCommand(AppController, Configuration, Language);
    Windows.Setting = new Window_Setting(AppController, Configuration, Language);
    Windows.Setting.Window.show();

    app.on('browser-window-blur', (event, window) => {
        switch(window.getTitle()) {
            case 'QuickCommandUI':
                Windows.QuickCommand!.Blur();
                break;
        }
    });
});

const AppController: Interfaces.AppController = {
    quit: (): void => process.exit(),

    restart: (): void => {
        globalShortcut.unregisterAll();
        shell.openExternal('commandist://?control=IgnorePreventingDuplicatedProcess');
        process.exit();
    }
}