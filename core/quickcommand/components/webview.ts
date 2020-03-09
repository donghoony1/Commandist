import { Interfaces } from '../../control/interfaces';

const ApplicationName: string = 'webview';

const application = (MS: Interfaces.ModuleSuite, args: Array<string>): Interfaces.ApplicationStandardReturn => {
    const URI: string = (args[0] === ApplicationName ? args.slice(1, args.length) : args).join('');
    if(!new RegExp(MS.Configuration['QuickCommand.v1.component.default.webview.v1.command.overrider']).test(URI)) {
        return [
            {
                Name: ApplicationName,
                Icon: {
                    FontAwesome: {
                        Icon: 'exclamation-triangle',
                        Type: 'duotone'
                    },
                    DefaultIcon: {
                        IconText: ApplicationName.toUpperCase(),
                        IconColor: 'red'
                    }
                },
                Output: {
                    Default: {
                        Subject: MS.Language['Commandist.v1.control.QuickCommand.v1.component.webview.return.invalid.subject'],
                        Description: MS.Language['Commandist.v1.control.QuickCommand.v1.component.webview.return.invalid.description']
                    }
                },
                Event: {},
                Error: true,
                DefaultApp: true
            }
        ];
    }
    return [
        {
            Name: ApplicationName,
            Icon: {
                DefaultIcon: {
                    IconText: ApplicationName.toUpperCase(),
                    IconColor: 'blue'
                }
            },
            Output: {
                Webview: {
                    URI,
                    Description: MS.Language['Commandist.v1.control.QuickCommand.v1.component.webview.return.description'],
                    Zoom: -5
                }
            },
            Event: {
                Click: [{
                    OpenExternal: {
                        URI
                    }
                }],
                Return: [{
                    OpenExternal: {
                        URI
                    }
                }],
                ShiftClick: [{
                    OpenExternal: {
                        URI
                    }
                }],
                ShiftReturn: [{
                    OpenExternal: {
                        URI
                    }
                }]
            },
            Error: false,
            DefaultApp: true
        }
    ];
};

export { application };