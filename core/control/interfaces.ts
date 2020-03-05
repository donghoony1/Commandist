import { BrowserWindow } from 'electron';

namespace Interfaces {

    export interface Windows {
        [key: string]: BrowserWindow
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
        UWP: Boolean
    }    
}

export { Interfaces };