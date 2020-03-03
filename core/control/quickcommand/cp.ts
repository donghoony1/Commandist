import { BrowserWindow } from 'electron';
import { Interfaces } from '../interfaces';

class CommandProcessor {
    private Configuration: Interfaces.Configuration;
    private QuickCommand: BrowserWindow;
    private shortcutReplacers: Interfaces.CPShortcutReplacers = {};
    private Commands: Interfaces.CPIntegrated = {};
    private Overriders: Interfaces.CPOverriders = {};

    constructor(Configuration: Interfaces.Configuration, QuickCommand: BrowserWindow) {
        this.Configuration = Configuration;
        this.QuickCommand = QuickCommand;
        this.Commands = {
            ...this.DefaultCommandLoader()
        }
    }

    public command = (event: any, arg: string): Boolean => {
        if(arg === undefined || arg === '') return false;

        let args = arg.split(' ');
        if(args.length === 0) return false;

        args[0] = this.ShortcutReplacer(args[0].toLowerCase());

        const primary: string = this.Overriders[Object.keys(this.Overriders).find((Overrider) => new RegExp(Overrider).test(arg)) || 'undefined'] || args[0];
        let result = this.Commands[primary].execute(args);
        this.QuickCommand.webContents.send('result', result);

        return true;
    }

    private ShortcutReplacer: Function = (primary: string): string => {
        return this.shortcutReplacers[primary] || primary;
    }
    
    private DefaultCommandLoader: Function = (): Interfaces.CPIntegrated => {
        let commands: Interfaces.CPIntegrated = {};
        const list = [
            'calculator'
        ];
        list.forEach((CommandName) => {
            if(this.Configuration[`QuickCommand.v1.commands.default.${CommandName}.v1.enabled`] === false) return false;
            commands[CommandName] = {
                execute: require(`../commands/${CommandName}`).application
            };
            if(this.Configuration[`QuickCommand.v1.commands.default.${CommandName}.v1.command.shortcutReplacers`] !== undefined) (this.Configuration[`QuickCommand.v1.commands.default.${CommandName}.v1.command.shortcutReplacers`] as Array<string>).forEach((replacer) => this.shortcutReplacers[replacer] = CommandName);
            if(this.Configuration[`QuickCommand.v1.commands.default.${CommandName}.v1.command.overrider`] !== undefined) this.Overriders[this.Configuration[`QuickCommand.v1.commands.default.${CommandName}.v1.command.overrider`] as string] = CommandName;
        })
        return commands;
    }
}

export { CommandProcessor };