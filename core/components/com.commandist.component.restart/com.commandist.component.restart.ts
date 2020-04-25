import { Interfaces } from '../../control/interfaces';

const Language: Interfaces.ComponentLanguage = {
    'ko-KR': {
        'return.subject': 'Commandist 다시 시작',
        'return.desciption': '애플리케이션을 다시 시작합니다.'
    }
};

const Component: Interfaces.Component = {
    ID: 'com.commandist.component.restart',
    Name: 'Restart',
    Description: 'An internal component for Commandist.',
    CallSign: 'restart',
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
                    Icon: 'redo-alt',
                    Type: 'duotone'
                },
                DefaultIcon: {
                    IconText: Component.Name.toUpperCase(),
                    IconColor: 'blue'
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
                        Action: 'Restart'
                    }
                }],
                Return: [{
                    Commandist: {
                        Action: 'Restart'
                    }
                }],
                ShiftClick: [{
                    Commandist: {
                        Action: 'Restart'
                    }
                }],
                ShiftReturn: [{
                    Commandist: {
                        Action: 'Restart'
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