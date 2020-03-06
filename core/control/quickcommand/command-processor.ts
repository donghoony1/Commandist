import { BrowserWindow, clipboard, shell, dialog, Notification } from 'electron';
import { Interfaces } from '../interfaces';
import { Md5 } from 'ts-md5/dist/md5';
import * as ChildProcess from 'child_process';
import * as fs from 'fs';

class CommandProcessor {
    private Configuration: Interfaces.Configuration;
    private Language: Interfaces.Language;
    private QuickCommand: BrowserWindow;
    
    private shortcutReplacers: Interfaces.CPShortcutReplacers = {};
    private Components: Interfaces.CPIntegrated = {};
    private Overriders: Interfaces.CPOverriders = {};

    private Preferences: { [key: string]: number } = {};

    constructor(Configuration: Interfaces.Configuration, Language: Interfaces.Language, QuickCommand: BrowserWindow) {
        this.Configuration = Configuration;
        this.Language = Language;
        this.QuickCommand = QuickCommand;
        this.Components = {
            ...this.DefaultCommandLoader()
        }

        const PreferenceDirectory: string = './applicationData/QuickCommand.v1/Command-Processor';
        if(!fs.existsSync(PreferenceDirectory)) fs.mkdirSync(PreferenceDirectory, { recursive: true });
        if(!fs.existsSync(`${ PreferenceDirectory }/preferences.json`)) fs.writeFileSync(`${ PreferenceDirectory }/preferences.json`, '{}');

        this.Preferences = JSON.parse(fs.readFileSync(`${ PreferenceDirectory }/preferences.json`, 'utf-8'));

        setInterval(() => {
            const Stringify: string = JSON.stringify(this.Preferences);
            if(Stringify !== fs.readFileSync(`${ PreferenceDirectory }/preferences.json`, 'utf-8')) fs.writeFileSync(`${ PreferenceDirectory }/preferences.json`, Stringify);
        }, 5000);
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
        let Results: Interfaces.ApplicationStandardReturn = [];
        if(this.Components[primary] !== undefined) Results = this.Components[primary].execute({ Configuration: this.Configuration, Language: this.Language }, args);
        
        if(Results.length === 0 && Object.keys(this.Components).includes('launcher')) Results = this.Components['launcher'].execute({ Configuration: this.Configuration, Language: this.Language }, args);

        const Preferences = this.Preferences;
        Object.keys(Preferences).forEach((Element) => {
            const Found = Results.findIndex((Result) => (new Md5().appendStr(JSON.stringify(Result)).end() as string) === Element);
            if(Found !== -1) {
                const Copy = Results[Found];
                Results.splice(Found, 1);
                Results.unshift(Copy);
            }
        });

        this.QuickCommand.webContents.send('result', Results);

        return true;
    }

    private ShortcutReplacer: Function = (primary: string): string => this.shortcutReplacers[primary] || primary;
    
    private DefaultCommandLoader: Function = (): Interfaces.CPIntegrated => {
        let components: Interfaces.CPIntegrated = {};
        const list: Array<string> = [ 'calculator', 'webview', 'launcher' ];
        list.forEach((CommandName) => {
            if(this.Configuration[`QuickCommand.v1.component.default.${CommandName}.v1.enabled`] === false) return false;
            components[CommandName] = { execute: require(`./components/${CommandName}`).application };
            if(this.Configuration[`QuickCommand.v1.component.default.${CommandName}.v1.command.shortcutReplacers`] !== undefined) (this.Configuration[`QuickCommand.v1.component.default.${CommandName}.v1.command.shortcutReplacers`] as Array<string>).forEach((replacer) => this.shortcutReplacers[replacer] = CommandName);
            if(this.Configuration[`QuickCommand.v1.component.default.${CommandName}.v1.command.overrider`] !== undefined) this.Overriders[this.Configuration[`QuickCommand.v1.component.default.${CommandName}.v1.command.overrider`] as string] = CommandName;
        });
        return components;
    }

    public execute = (event: any, args: { Return: Interfaces.ApplicationStdReturnInstance, ShiftKey: Boolean, IsClick: Boolean }): void => {
        let Results: Array<string> = [];
        const ReplaceStringToResult = (string: string): string => string.replace(/\${Result\[(\d+)\]}/g, Results[parseInt(RegExp.$1 as string) || 0]);

        ////////////////////////////////////////////////////////////////////////
        ///                                                                  ///
        ///   The current code is temporary.                                 ///
        ///                                                                  ///
        ///   TODO: Refactor to simplify.                                    ///
        ///                                                                  ///
        ////////////////////////////////////////////////////////////////////////
        const EventType: Interfaces.ApplicationEventTypeList = ((args.ShiftKey === true ? 'Shift' : '') + (args.IsClick === true ? 'Click' : 'Return') as Interfaces.ApplicationEventTypeList || 'Click');
        const Event: Array<Interfaces.ApplicationAction> = args.Return.Event[EventType]!;
        if(!Event) return;
        const arlen: number = Event.length;
        for(let i = 0; i < arlen; i++) {
            let result: string = '';
            const arg = Event[i];
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
            } else if(arg.Dialog !== undefined) {
                if(0 < arg.Dialog.Buttons.length && arg.Dialog.Buttons.length < arg.Dialog.CancelID) {
                    result = `${dialog.showMessageBoxSync(this.QuickCommand, {
                        type: arg.Dialog.Type,
                        buttons: arg.Dialog.Buttons,
                        cancelId: arg.Dialog.CancelID,
                        defaultId: 0,
                        title: 'The Commandist',
                        message: arg.Dialog.Message,
                        detail: arg.Dialog.Detail
                    })}`;
                }
            } else if(arg.Notification !== undefined) {
                new Notification({
                    title: arg.Notification.Title,
                    body: arg.Notification.Body,
                    silent: arg.Notification.Silent === true
                }).show();
            }
            Results.push(result);
        };

        const Hash: string = new Md5().appendStr(JSON.stringify(args.Return)).end() as string;
        if(this.Preferences[Hash] === undefined) this.Preferences[Hash] = 0;
        this.Preferences[Hash] += 1;

        const CopiedPreferences: { [key: string]: number } = this.Preferences;
        const TemporaryPreferences: { [key: string]: number } = {};
        Object.keys(CopiedPreferences).sort((a, b) => CopiedPreferences[a] - CopiedPreferences[b]).forEach((Element) => TemporaryPreferences[Element] = CopiedPreferences[Element]);
        this.Preferences = TemporaryPreferences;
    }
}

export { CommandProcessor };