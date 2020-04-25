import { Interfaces } from '../../control/interfaces';

const Language: Interfaces.ComponentLanguage = {
    'ko-KR': {
        'return.invalid.subject': '오류가 발생했습니다.',
        'return.invalid.description': '유효한 URI를 입력하십시오.',
        'return.description': '웹 브라우저에서 실행하려면 Return을 누르십시오.'
    }
};

const Component: Interfaces.Component = {
    ID: 'com.commandist.component.webview',
    Name: 'WebView',
    Description: 'An internal component for Commandist.',
    CallSign: 'webview',
    RegExp: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
    Version: {
        Major: 0,
        Minor: 0,
        Build: 2
    },
    Authors: [
        {
            Name: 'DongHoon Yoo',
            EMail: 'yoodonghoon01@gmail.com',
            URIs: [
                {
                    Name: 'Blog',
                    URI: 'https://blog.donghoonyoo.com'
                },
                {
                    Name: 'GitHub',
                    URI: 'https://github.com/donghoony1'
                }
            ]
        }
    ],
    Setting: {
        Default: {

        },
        UI: [
            
        ]
    }
};

const Execute = (LanguagePreference: string, args: Array<string>): Interfaces.ApplicationStandardReturn => {
    const L: Interfaces.Language = Language[LanguagePreference];
    
    const URI: string = (args[0] === Component.CallSign ? args.slice(1, args.length) : args).join('');
    if(!new RegExp(Component.RegExp!).test(URI)) {
        return [
            {
                Name: Component.Name,
                Icon: {
                    FontAwesome: {
                        Icon: 'exclamation-triangle',
                        Type: 'duotone'
                    },
                    DefaultIcon: {
                        IconText: Component.Name.toUpperCase(),
                        IconColor: 'red'
                    }
                },
                Output: {
                    Default: {
                        Subject: L['return.invalid.subject'],
                        Description: L['return.invalid.description']
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
            Name: Component.Name,
            Icon: {
                DefaultIcon: {
                    IconText: Component.Name.toUpperCase(),
                    IconColor: 'blue'
                }
            },
            Output: {
                Webview: {
                    URI,
                    Description: L['return.description'],
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

let Configuration: Interfaces.Configuration = {};
const ConfigurationInit = (GivenConfiguration: Interfaces.Configuration) => Configuration = GivenConfiguration;
export { Component, Execute, Configuration, ConfigurationInit };