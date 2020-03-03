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

    export type ApplicationStandardReturn = Array<ApplicationStdReturnInstance>

    export interface ApplicationStdReturnInstance {
        ApplicationName: string,
        ApplicationIcon: {
            ImageFileName?: string,
            DefaultIcon: {
                IconText: string,
                IconColor: 'red' | 'orange' | 'yellow' | 'green' | 'brightGreen' | 'blue' | 'brightBlue' | 'ingido' | 'purple' | 'brightPurple' | 'dark' | 'light'
            }
        },
        Output: {
            Default?: {
                Subject: string,
                Description: string
            }
        },
        Event: {
            Click?: Array<ApplicationAction>,
            Return?: Array<ApplicationAction>,
            ShiftClick?: Array<ApplicationAction>,
            ShiftReturn?: Array<ApplicationAction>
        }
    }

    export interface ApplicationAction {
        Commandist?: {
            Action: 'Quit' | 'Restart' | 'OpenSettings'
        },
        CopyText?: {
            Data: string | number
        },
        Execute?: {
            Process: string,
            Arguments?: string
        },
        OSInteraction?: {
            Shutdown?: {
                Time: number,
                Force?: Boolean
            },
            Restart?: {
                Time: number,
                Force?: Boolean
            },
            Windows?: {
                Action: 'Lock' | 'Logout'
            }
        }
    }

}

export { Interfaces };