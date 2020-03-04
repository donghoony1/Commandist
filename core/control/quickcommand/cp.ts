import { BrowserWindow } from 'electron';
import { Interfaces } from '../interfaces';

class CommandProcessor {
    private Configuration: Interfaces.Configuration;
    private QuickCommand: BrowserWindow;
    private shortcutReplacers: Interfaces.CPShortcutReplacers = {};
    private Components: Interfaces.CPIntegrated = {};
    private Overriders: Interfaces.CPOverriders = {};

    constructor(Configuration: Interfaces.Configuration, QuickCommand: BrowserWindow) {
        this.Configuration = Configuration;
        this.QuickCommand = QuickCommand;
        this.Components = {
            ...this.DefaultCommandLoader()
        }
    }

    public command = (event: any, arg: string): Boolean => {
        if(arg === undefined) return false;
        if(arg === '') {
            this.QuickCommand.webContents.send('result', []);
            return true;
        }

        let args = arg.split(' ');

        args[0] = this.ShortcutReplacer(args[0].toLowerCase());

        const primary: string = this.Overriders[Object.keys(this.Overriders).find((Overrider) => new RegExp(Overrider).test(arg)) || 'undefined'] || args[0];
        let result: Interfaces.ApplicationStandardReturn = [];
        if(this.Components[primary] !== undefined) result = this.Components[primary].execute({ Configuration: this.Configuration }, args);
        
        if(result.length === 0 && Object.keys(this.Components).includes('launcher')) result = this.Components['launcher'].execute({ Configuration: this.Configuration }, args);

        this.QuickCommand.webContents.send('result', result);

        return true;
    }

    private ShortcutReplacer: Function = (primary: string): string => {
        return this.shortcutReplacers[primary] || primary;
    }
    
    private DefaultCommandLoader: Function = (): Interfaces.CPIntegrated => {
        let components: Interfaces.CPIntegrated = {};
        const list: Array<string> = [
            'calculator', 'webview', 'launcher'
        ];
        list.forEach((CommandName) => {
            if(this.Configuration[`QuickCommand.v1.components.default.${CommandName}.v1.enabled`] === false) return false;
            components[CommandName] = {
                execute: require(`../components/${CommandName}`).application
            };
            if(this.Configuration[`QuickCommand.v1.components.default.${CommandName}.v1.command.shortcutReplacers`] !== undefined) (this.Configuration[`QuickCommand.v1.components.default.${CommandName}.v1.command.shortcutReplacers`] as Array<string>).forEach((replacer) => this.shortcutReplacers[replacer] = CommandName);
            if(this.Configuration[`QuickCommand.v1.components.default.${CommandName}.v1.command.overrider`] !== undefined) this.Overriders[this.Configuration[`QuickCommand.v1.components.default.${CommandName}.v1.command.overrider`] as string] = CommandName;
        });
        return components;
    }
}

export { CommandProcessor };