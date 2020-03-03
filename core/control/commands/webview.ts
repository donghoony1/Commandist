import { Interfaces } from '../interfaces';

const ApplicationName = 'webview';

const application = (MS: Interfaces.ModuleSuite, args: Array<string>): Interfaces.ApplicationStandardReturn => {
    const URI: string = (args[0] === ApplicationName ? args.slice(1, args.length) : args).join('');
    if(!new RegExp(MS.Configuration['QuickCommand.v1.commands.default.webview.v1.command.overrider']).test(URI)) {
        return [
            {
                Name: ApplicationName,
                Icon: {
                    DefaultIcon: {
                        IconText: ApplicationName.toUpperCase(),
                        IconColor: 'red'
                    }
                },
                Output: {
                    Default: {
                        Subject: '오류가 발생했습니다.',
                        Description: '유효한 URI를 입력하세요.'
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
                    Description: '웹 브라우저에서 보려면 Return을 누르세요.',
                    Zoom: -5
                }
            },
            Event: {
                Click: [{
                    Execute: {
                        Process: 'cmd.exe',
                        Arguments: '/c start ' + URI,
                        AtBackground: true
                    }
                }]
            },
            Error: false,
            DefaultApp: true
        }
    ];
};

export { application };