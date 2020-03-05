import { BrowserWindow, clipboard, shell } from 'electron';
import { Interfaces } from '../interfaces';
import * as ChildProcess from 'child_process';

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

    private ShortcutReplacer: Function = (primary: string): string => this.shortcutReplacers[primary] || primary;
    
    private DefaultCommandLoader: Function = (): Interfaces.CPIntegrated => {
        let components: Interfaces.CPIntegrated = {};
        const list: Array<string> = [ 'calculator', 'webview', 'launcher' ];
        list.forEach((CommandName) => {
            if(this.Configuration[`QuickCommand.v1.components.default.${CommandName}.v1.enabled`] === false) return false;
            components[CommandName] = { execute: require(`../components/${CommandName}`).application };
            if(this.Configuration[`QuickCommand.v1.components.default.${CommandName}.v1.command.shortcutReplacers`] !== undefined) (this.Configuration[`QuickCommand.v1.components.default.${CommandName}.v1.command.shortcutReplacers`] as Array<string>).forEach((replacer) => this.shortcutReplacers[replacer] = CommandName);
            if(this.Configuration[`QuickCommand.v1.components.default.${CommandName}.v1.command.overrider`] !== undefined) this.Overriders[this.Configuration[`QuickCommand.v1.components.default.${CommandName}.v1.command.overrider`] as string] = CommandName;
        });
        return components;
    }

    public execute = (event: any, args: Array<Interfaces.ApplicationAction>): void => {
        let results: Array<string> = [];
        const ReplaceStringToResult = (string: string): string => string.replace(/\${Result\[(\d+)\]}/g, results[parseInt(RegExp.$1 as string) || 0]);

        ////////////////////////////////////////////////////////////////////////
        ///                                                                  ///
        ///   The current code is temporary.                                 ///
        ///                                                                  ///
        ///   TODO: Refactor to simplify.                                    ///
        ///                                                                  ///
        ////////////////////////////////////////////////////////////////////////
        const arlen: number = args.length;
        for(let i = 0; i < arlen; i++) {
            let result: string = '';
            const arg = args[i];
            if(arg.Commandist !== undefined) {
                switch(arg.Commandist.Action) {
                    case 'Quit': {
                        process.exit();
                    }
                    case 'Restart': {
                        // TODO:
                        break;
                    }
                    case 'OpenSettings': {
                        // TODO:
                        break;
                    }
                }
            } else if(arg.CopyText !== undefined) {
                clipboard.writeText(ReplaceStringToResult(arg.CopyText.Data) || '');
            } else if(arg.Execute !== undefined) {
                let options: { [key: string]: any } = { 
                    cwd: arg.Execute.CurrentWorkingDirectory || undefined,
                    timeout: arg.Execute.Timeout || undefined,
                    windowsHide: arg.Execute.AtBackground 
                };

                if(arg.Execute.Synchronize === true) result = ChildProcess.execSync(`${ arg.Execute.Process } ${arg.Execute.Arguments.map((Argument) => ReplaceStringToResult(Argument)).join(' ')}`, options).toString();
                else ChildProcess.spawn(arg.Execute.Process, arg.Execute.Arguments.map((Argument) => ReplaceStringToResult(Argument)), options);
            } else if(arg.ControlOS !== undefined) {
                switch(process.platform) {
                    case 'win32': {
                        switch(arg.ControlOS.Action) {
                            case 'Shutdown': {
                                if(arg.ControlOS.HideWarn !== undefined && arg.ControlOS.HideWarn === true) {
                                    setTimeout(() => {
                                        ChildProcess.execSync(`shutdown -s ${ arg.ControlOS!.Force !== undefined && '-f ' }-t 0`, { windowsHide: true });
                                    }, arg.ControlOS.Time);
                                } else ChildProcess.execSync(`shutdown -s ${ arg.ControlOS.Force !== undefined && '-f ' }-t ${ arg.ControlOS.Time }`, { windowsHide: true });
                                break;
                            }
                            case 'Restart': {
                                if(arg.ControlOS.HideWarn !== undefined && arg.ControlOS.HideWarn === true) {
                                    setTimeout(() => {
                                        ChildProcess.execSync(`shutdown -r ${ arg.ControlOS!.Force !== undefined && '-f ' }-t 0`, { windowsHide: true });
                                    }, arg.ControlOS.Time);
                                } else ChildProcess.execSync(`shutdown -r ${ arg.ControlOS.Force !== undefined && '-f ' }-t ${ arg.ControlOS.Time }`, { windowsHide: true });
                                break;
                            }
                            case 'Logout': {
                                if(arg.ControlOS.HideWarn !== undefined && arg.ControlOS.HideWarn === true) {
                                    setTimeout(() => {
                                        ChildProcess.execSync(`shutdown -l ${ arg.ControlOS!.Force !== undefined && '-f ' }-t 0`, { windowsHide: true });
                                    }, arg.ControlOS.Time);
                                } else ChildProcess.execSync(`shutdown -l ${ arg.ControlOS.Force !== undefined && '-f ' }-t ${ arg.ControlOS.Time }`, { windowsHide: true });
                                break;
                            }
                            case 'Lock': {
                                setTimeout(() => ChildProcess.execSync(`rundll32.exe user32.dll,LockWorkStation`, { windowsHide: true }), arg.ControlOS.Time);
                                break;
                            }
                            case 'Suspend': {
                                setTimeout(() => ChildProcess.execSync(`rundll32.exe powrprof.dll,SetSuspendState 0,1,0`, { windowsHide: true }), arg.ControlOS.Time);
                                break;
                            }
                            case 'Hibernate': {
                                setTimeout(() => ChildProcess.execSync(`rundll32.exe PowrProf.dll,SetSuspendState`, { windowsHide: true }), arg.ControlOS.Time);
                                break;
                            }
                        }
                    }
                }
            } else if(arg.OpenExternal !== undefined) {
                shell.openExternal(arg.OpenExternal.URI);
            }
            results.push(result);
        };
    }
}

export { CommandProcessor };