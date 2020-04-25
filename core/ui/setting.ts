import { Interfaces } from '../control/interfaces';

class UI_Setting {
    Language: Interfaces.Language;

    constructor(Language: Interfaces.Language) {
        this.Language = Language;
    }

    get() {
        return [
            {
                Subject: this.Language['Commandist.v1.Setting.v1.commandist'],
                Menus: [
                    {
                        Subject: this.Language['Commandist.v1.Setting.v1.commandist.setting'],
                        Sections: [
                            {
                                Subject: this.Language['Commandist.v1.Setting.v1.commandist.setting.general'],
                                Settings: [
                                    /*{
                                        ID: '',
                                        Name: this.Language['Commandist.v1.Setting.v1.commandist.setting.general.autorun.subject'],
                                        Description: this.Language['Commandist.v1.Setting.v1.commandist.setting.general.autorun.description'],
                                        Type: 'Toggle'
                                    },*/
                                    {
                                        ID: 'Commandist.v1.notification.run.eanbled',
                                        Name: this.Language['Commandist.v1.Setting.v1.commandist.setting.general.runnotification.subject'],
                                        Description: this.Language['Commandist.v1.Setting.v1.commandist.setting.general.runnotification.description'],
                                        Type: 'Toggle'
                                    }
                                ]
                            },
                            // {
                            //     Subject: this.Language['Commandist.v1.Setting.v1.commandist.setting.batterysaving'],
                            //     Settings: [
                            //         {
                            //             ID: '',
                            //             Name: this.Language['Commandist.v1.Setting.v1.commandist.setting.batterysaving.indexing.subject'],
                            //             Description: this.Language['Commandist.v1.Setting.v1.commandist.setting.batterysaving.indexing.description'],
                            //             Type: 'Toggle'
                            //         }
                            //     ]
                            // }
                        ]
                    },
                    {
                        Subject: this.Language['Commandist.v1.Setting.v1.commandist.quickcommand'],
                        Sections: [
                            {
                                Subject: this.Language['Commandist.v1.Setting.v1.commandist.quickcommand.appearance'],
                                Settings: [
                                    {
                                        ID: 'QuickCommand.v1.window.appearance.logo',
                                        Name: this.Language['Commandist.v1.Setting.v1.commandist.quickcommand.appearance.logo.subject'],
                                        Description: this.Language['Commandist.v1.Setting.v1.commandist.quickcommand.appearance.logo.description'],
                                        Type: 'Toggle'
                                    },
                                    {
                                        ID: 'QuickCommand.v1.window.appearance.state',
                                        Name: this.Language['Commandist.v1.Setting.v1.commandist.quickcommand.appearance.state.subject'],
                                        Description: this.Language['Commandist.v1.Setting.v1.commandist.quickcommand.appearance.state.description'],
                                        Type: 'Toggle'
                                    }
                                ]
                            },
                            {
                                Subject: this.Language['Commandist.v1.Setting.v1.commandist.quickcommand.shortcutkey'],
                                Settings: [
                                    {
                                        ID: 'QuickCommand.v1.window.call.shortcutkey.enabled',
                                        Name: this.Language['Commandist.v1.Setting.v1.commandist.quickcommand.shortcutkey.enable.subject'],
                                        Description: this.Language['Commandist.v1.Setting.v1.commandist.quickcommand.shortcutkey.enable.description'],
                                        Type: 'Toggle'
                                    },
                                    {
                                        ID: 'QuickCommand.v1.window.call.shortcutkey.definition1',
                                        Name: this.Language['Commandist.v1.Setting.v1.commandist.quickcommand.shortcutkey.definition1.subject'],
                                        Description: this.Language['Commandist.v1.Setting.v1.commandist.quickcommand.shortcutkey.definition1.description'],
                                        Type: 'Select',
                                        Definition: {
                                            Select: {
                                                Selections: [
                                                    'CommandOrControl',
                                                    'CommandOrControl+Alt',
                                                    'CommandOrControl+Alt+Shift',
                                                    'CommandOrControl+Alt+Shift+Super',
                                                    'CommandOrControl+Alt+Super',
                                                    'CommandOrControl+Shift',
                                                    'CommandOrControl+Shift+Super',
                                                    'Alt',
                                                    'Alt+Shift',
                                                    'Alt+Shift+Super',
                                                    'Alt+Super',
                                                    'Shift',
                                                    'Shift+Super',
                                                    'Super'
                                                ]
                                            }
                                        }
                                    },
                                    {
                                        ID: 'QuickCommand.v1.window.call.shortcutkey.definition2',
                                        Name: this.Language['Commandist.v1.Setting.v1.commandist.quickcommand.shortcutkey.definition2.subject'],
                                        Description: this.Language['Commandist.v1.Setting.v1.commandist.quickcommand.shortcutkey.definition2.description'],
                                        Type: 'Select',
                                        Definition: {
                                            Select: {
                                                Selections: [
                                                    ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
                                                    ...'0123456789'.split(''),
                                                    '`',
                                                    ' Space',
                                                    'Plus',
                                                    '-',
                                                    'Up',
                                                    'Down',
                                                    'Left',
                                                    'Right',
                                                    'Home',
                                                    'End',
                                                    'PageUp',
                                                    'PageDown',
                                                    ...'0123456789'.split('').map((number) => `num${number}`),
                                                    'numdec',
                                                    'numadd',
                                                    'numsub',
                                                    'nummult',
                                                    'numdiv',
                                                    ...'1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24'.split(' ').map((number) => `F${number}`)
                                                ]
                                            }
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                Subject: this.Language['Commandist.v1.Setting.v1.component.default'],
                Menus: [
                ]
            },
            {
                Subject: this.Language['Commandist.v1.Setting.v1.component.extension'],
                Menus: [
                ]
            }
        ];
    }
}

export { UI_Setting };