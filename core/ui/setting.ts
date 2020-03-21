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
                                        ID: 'QuickCommand.v1.window.call.shortcutkey.definition',
                                        Name: this.Language['Commandist.v1.Setting.v1.commandist.quickcommand.shortcutkey.definition1.subject'],
                                        Description: this.Language['Commandist.v1.Setting.v1.commandist.quickcommand.shortcutkey.definition1.description'],
                                        Type: 'Select',
                                        Select: {
                                            Placeholder: 2,
                                            Selections: [
                                                'CommandOrControl',
                                                'CommandOrControl+Alt',
                                                'CommandOrControl+Alt+Shift',
                                                'CommandOrControl+Shift',
                                                'Alt',
                                                'Alt+Shift',
                                                'Shift'
                                            ]
                                        }
                                    },
                                    {
                                        ID: 'QuickCommand.v1.window.call.shortcutkey.definition',
                                        Name: this.Language['Commandist.v1.Setting.v1.commandist.quickcommand.shortcutkey.definition2.subject'],
                                        Description: this.Language['Commandist.v1.Setting.v1.commandist.quickcommand.shortcutkey.definition2.description'],
                                        Type: 'Select',
                                        Select: {
                                            Placeholder: 2,
                                            Selections: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ];
    }
}

export { UI_Setting };