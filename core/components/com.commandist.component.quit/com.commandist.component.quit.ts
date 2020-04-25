import { Interfaces } from '../../control/interfaces';

const Language: Interfaces.ComponentLanguage = {
    'ko-KR': {
        'return.subject': 'Commandist 종료',
        'return.desciption': '애플리케이션을 종료합니다.'
    }
};

const Component: Interfaces.Component = {
    ID: 'com.commandist.component.quit',
    Name: 'Quit',
    Description: 'An internal component for Commandist.',
    CallSign: 'quit',
    RegExp: undefined,
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

    return [
        {
            Name: Component.Name,
            Icon: {
                FontAwesome: {
                    Icon: 'times-circle',
                    Type: 'duotone'
                },
                DefaultIcon: {
                    IconText: Component.Name.toUpperCase(),
                    IconColor: 'red'
                }
            },
            Output: {
                Default: {
                    Subject: L['return.subject'],
                    Description: L['return.description']
                }
            },
            Event: {
                Click: [{
                    Commandist: {
                        Action: 'Quit'
                    }
                }],
                Return: [{
                    Commandist: {
                        Action: 'Quit'
                    }
                }],
                ShiftClick: [{
                    Commandist: {
                        Action: 'Quit'
                    }
                }],
                ShiftReturn: [{
                    Commandist: {
                        Action: 'Quit'
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