import { Interfaces } from './interfaces';
import * as path from 'path';
import * as fs from 'fs';

const DefaultConfiguration: Interfaces.Configuration = {
    'Commandist.v1.Language': 'ko-KR',
    'Commandist.v1.notification.run.eanbled': true,
    
    'QuickCommand.v1.window.call.shortcutkey.enabled': true,
    'QuickCommand.v1.window.call.shortcutkey.definition1': 'Shift',
    'QuickCommand.v1.window.call.shortcutkey.definition2': 'Space',

    'QuickCommand.v1.window.appearance.logo': true,
    'QuickCommand.v1.window.appearance.state': true,

    'QuickCommand.v1.component.default.com.commandist.component.calculator.v1.enabled': true,

    'QuickCommand.v1.component.default.com.commandist.component.webview.v1.enabled': true,

    'QuickCommand.v1.component.default.com.commandist.component.launcher.v1.enabled': true,
    'QuickCommand.v1.component.default.com.commandist.component.launcher.v1.feature.compatible': [ 'win32' ],
    'QuickCommand.v1.component.default.com.commandist.component.launcher.v1.service.cache.updatinginterval': 60000,
    'QuickCommand.v1.component.default.com.commandist.component.launcher.v1.service.win32.universal-windows-platform.blacklist': [ 'ms-resource' ],
    'QuickCommand.v1.component.default.com.commandist.component.launcher.v1.service.win32.universal-windows-platform.dictionary': {
        'ms-resource:StickyNotesStoreAppName': 'Sticky Notes'
    },

    'QuickCommand.v1.component.default.quit.v1.enabled': true
}

const Path: Interfaces.ConfigurationPath = {
    Directory: path.join(__dirname, '..', '..', process.env.build === 'application' ? '..' : '', 'configurations'), 
    File: path.join(__dirname, '..', '..', process.env.build === 'application' ? '..' : '', 'configurations', 'configuration.json')
};

const OpenFile = (): Interfaces.Configuration => {
    if(!fs.existsSync(Path.Directory)) fs.mkdirSync(Path.Directory);
    if(!fs.existsSync(Path.File)) fs.writeFileSync(Path.File, '{}');
    return JSON.parse(fs.readFileSync(Path.File, 'utf-8'));
}

const Load = (): Interfaces.Configuration => {
    const User: Interfaces.Configuration = OpenFile();
    let Output: Interfaces.Configuration = DefaultConfiguration;
    Object.assign(Output, User);
    return Output;
}

const Modify = (Type: Interfaces.SettingTypes, ID: string, Value: Interfaces.SettingValue): void => {
    let User: Interfaces.Configuration = OpenFile();
    
    switch(Type) {
        case 'Select':
            User[ID] = Value.Select!;
            break;
        case 'Toggle':
            User[ID] = Value.Toggle === true
            break;
    }

    fs.writeFileSync(Path.File, JSON.stringify(User));
}

export { Load, Modify };