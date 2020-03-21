import { Interfaces } from './interfaces';
import * as path from 'path';
import * as fs from 'fs';

const DefaultConfiguration: Interfaces.Configuration = {
    'Commandist.v1.Language': 'ko-KR',
    'Commandist.v1.notification.run.eanbled': true,
    
    'QuickCommand.v1.window.call.shortcutkey.enabled': true,
    'QuickCommand.v1.window.call.shortcutkey.definition': 'CommandOrControl+Alt+Shift+S',

    'QuickCommand.v1.window.appearance.logo': true,
    'QuickCommand.v1.window.appearance.state': true,

    'QuickCommand.v1.component.default.calculator.v1.enabled': true,
    'QuickCommand.v1.component.default.calculator.v1.command.shortcutReplacers': [ 'c' ],
    'QuickCommand.v1.component.default.calculator.v1.command.overrider': '^(\\(?([\\s]+)?([\\d.]+|(\\+|-|\\*|\\/|\\*\\*|\\^|%))?\\)?)+$',

    'QuickCommand.v1.component.default.webview.v1.enabled': true,
    'QuickCommand.v1.component.default.webview.v1.command.shortcutReplacers': [],
    'QuickCommand.v1.component.default.webview.v1.command.overrider': '^https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)$',

    'QuickCommand.v1.component.default.launcher.v1.enabled': true,
    'QuickCommand.v1.component.default.launcher.v1.feature.compatible': [ 'win32' ],
    'QuickCommand.v1.component.default.launcher.v1.service.cache.updatinginterval': 60000,
    'QuickCommand.v1.component.default.launcher.v1.service.win32.universal-windows-platform.blacklist': [ 'ms-resource' ],
    'QuickCommand.v1.component.default.launcher.v1.service.win32.universal-windows-platform.dictionary': {
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
        case 'Toggle':
            User[ID] = Value.Toggle === true
            break;
    }

    fs.writeFileSync(Path.File, JSON.stringify(User));
}

export { Load, Modify };