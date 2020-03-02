import { BrowserWindow } from 'electron';

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