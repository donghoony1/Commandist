import { BrowserWindow } from 'electron';

namespace Interfaces {

    export interface Windows {
        [key: string]: BrowserWindow
    }

    export interface Configuration {
        [key: string]: ConfigurationValue
    }

    export type ConfigurationValue = boolean | string | number | Array<any>;

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
        Event: {
            Click?: Array<ApplicationAction>,
            Return?: Array<ApplicationAction>,
            ShiftClick?: Array<ApplicationAction>,
            ShiftReturn?: Array<ApplicationAction>
        },
        Error: Boolean,
        DefaultApp: Boolean
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
        }
    }

    export interface LauncherV1Applications {
        Name: string,
        LnkPath: string,
        ActualPath: string,
        LnkPathMD5: string
    }    
}

export { Interfaces };