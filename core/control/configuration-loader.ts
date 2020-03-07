import { Interfaces } from './interfaces';
import * as path from 'path';
import * as fs from 'fs';

const DefaultConfiguration: Interfaces.Configuration = {
    'Commandist.v1.Language': 'ko-KR',
    
    'QuickCommand.v1.window.call.shortcutkey': 'CommandOrControl+Alt+Shift+S',

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
    }
}

const Load = (): Interfaces.Configuration => {
    const Path: Interfaces.ConfigurationPath = {
        Directory: path.join(__dirname, '..', '..', 'configurations'), 
        File: path.join(__dirname, '..', '..', 'configurations', 'configuration.json')
    };
    if(!fs.existsSync(Path.Directory)) fs.mkdirSync(Path.Directory);
    if(!fs.existsSync(Path.File)) fs.writeFileSync(Path.File, '{}');
    const User: Interfaces.Configuration = JSON.parse(fs.readFileSync(Path.File, 'utf-8'));
    let Output: Interfaces.Configuration = DefaultConfiguration;
    Object.assign(Output, User);
    return Output;
}

export { Load };