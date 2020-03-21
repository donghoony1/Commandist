import { Window_QuickCommand } from '../window/quickcommand';
import { Window_Setting } from '../window/setting';
import { ChildProcess } from 'child_process';

namespace Interfaces {
    export interface ProtocolURI {
        control?: 'IgnorePreventingDuplicatedProcess'
    }

    export interface AppController {
        [type: string]: Function
    }

    export interface Windows {
        QuickCommand?: Window_QuickCommand,
        Setting?: Window_Setting
    }

    export interface Workers {
        [key: string]: ChildProcess
    }

    export interface Configuration {
        [key: string]: ConfigurationValue
    }

    export type ConfigurationValue = boolean | string | number | Array<any> | { [key: string]: string };

    export interface Language {
        [key: string]: string
    }

    export type LanguageTypeList = 'ko-KR' | 'en-US'

    export interface ConfigurationPath {
        Directory: string, 
        File: string
    }

    export interface CPIntegrated {
        [key: string]: {
            execute: Function
        }
    }

    export interface CPShortcutReplacers {
        [key: string]: string
    }

    export interface CPOverriders {
        [key: string]: string
    }

    export type Operator = '+' | '-' | '*' | '/' | '**' | '%'

    export interface ModuleSuite {
        [key: string]: any
    }

    export type ApplicationStandardReturn = Array<ApplicationStdReturnInstance>

    export interface ApplicationStdReturnInstance {
        Name: string,
        Icon: {
            ImageFilePath?: string,
            FontAwesome?: {
                Icon: string,
                Type: 'solid' | 'regular' | 'light' | 'duotone' | 'brands'
            }
            DefaultIcon: {
                IconText: string,
                IconColor: 'red' | 'orange' | 'yellow' | 'green' | 'brightGreen' | 'blue' | 'brightBlue' | 'ingido' | 'purple' | 'brightPurple' | 'dark' | 'light'
            }
        },
        Output: {
            Default?: {
                Subject: string,
                Description: string
            },
            Webview?: {
                URI: string,
                Description: string,
                Zoom?: number
            }
        },
        Event: ApplicationEventTypes,
        Error: Boolean,
        DefaultApp: Boolean
    }

    export type ApplicationEventTypeList = 'Click' | 'Return' | 'ShiftClick' | 'ShiftReturn'

    export interface ApplicationEventTypes {
        'Click'?: Array<ApplicationAction>,
        'Return'?: Array<ApplicationAction>,
        'ShiftClick'?: Array<ApplicationAction>,
        'ShiftReturn'?: Array<ApplicationAction>
    }

    export interface ApplicationAction {
        Commandist?: {
            Action: 'Quit' | 'Restart' | 'OpenSettings'
        },
        CopyText?: {
            Data: string
        },
        Execute?: {
            Process: string,
            Arguments: Array<string>,
            CurrentWorkingDirectory?: string,
            Timeout?: number,
            AtBackground: Boolean,
            Synchronize: Boolean
        },
        ControlOS?: {
            Action: 'Shutdown' | 'Restart' | 'Logout' | 'Lock' | 'Suspend' | 'Hibernate'
            Time: number,
            Force?: Boolean,
            HideWarn?: Boolean
        },
        OpenExternal?: {
            URI: string
        },
        Dialog?: {
            Type: 'none' | 'info' | 'error' | 'question' | 'warning',
            Message: string,
            Detail: string,
            Buttons: Array<string>,
            CancelID: number
        },
        Notification?: {
            Title: string,
            Body: string,
            Silent: Boolean
        }
    }

    export interface LauncherV1ApplicationsWin32 {
        Name: string,
        ActualPath: string,
        IconPath: string,
        AppX: Boolean
    }

    export interface SettingUIMenu {
        Subject: string,
        Menus: Array<SettingUI>
    }

    export interface SettingUI {
        Subject: string,
        Sections: Array<{
            Subject: string,
            Settings: Array<{
                ID: string,
                Name: string,
                Description?: string
                Type: SettingTypes,
                Input?: {
                    Placeholder: string,
                    Rules: Array<{
                        ErrorMessage: string,
                        RegExp: RegExp
                    }>
                },
                TextArea?: {
                    Placeholder: string,
                    Rules: Array<{
                        ErrorMessage: string,
                        RegExp: RegExp
                    }>
                },
                Number?: {
                    Placeholder: number,
                    Rules: Array<{
                        ErrorMessage: string,
                        Minimum: number,
                        Maximum: number
                    }>
                },
                Select?: {
                    Placeholder: number,
                    Selections: Array<string>
                }
            }>
        }>
    }

    export type SettingTypes = 'Input' | 'TextArea' | 'Number' | 'Select' | 'Toggle';

    export interface SettingValue {
        Input?: string,
        TextArea?: string,
        Number?: number,
        Select?: {
            Selection: number,
            Selections: Array<string>
        },
        Toggle?: Boolean
    }
}

export { Interfaces };