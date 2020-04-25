import { Interfaces } from '../../control/interfaces';

const Language: Interfaces.ComponentLanguage = {
    'ko-KR': {
        'return.invalid.subject': '오류가 발생했습니다.',
        'return.invalid.description': '유효한 수식을 입력하십시오.',
        'return.description': '결과를 복사하려면 Return을 누르십시오.'
    }
};

const Component: Interfaces.Component = {
    ID: 'com.commandist.component.calculator',
    Name: 'Quit',
    Description: 'An internal component for Commandist.',
    CallSign: 'quit',
    RegExp: /^(\(?([\s]+)?([\d.]+|(\+|-|\*|\/|\*\*|\^|%))?\)?)+$/,
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

    const evil:Function = (fn: string): number => {
        try {
            return new Function('return ' + fn)();
        } catch(Exception) {
            return Exception;
        }
    }
    
    const number_format = (x: number): string => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    const Data: number = evil((args[0] === Component.CallSign ? args.slice(1, args.length) : args).join('').replace(/\^/, '**'));
    if(isNaN(Data)) {
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
    const DataFormatted: string = number_format(Data);
    return [
        {
            Name: Component.Name,
            Icon: {
                FontAwesome: {
                    Icon: 'calculator-alt',
                    Type: 'duotone'
                },
                DefaultIcon: {
                    IconText: Component.Name.toUpperCase(),
                    IconColor: 'brightGreen'
                }
            },
            Output: {
                Default: {
                    Subject: DataFormatted,
                    Description: L['return.description']
                }
            },
            Event: {
                Click: [{
                    CopyText: {
                        Data: `${Data}`
                    }
                }],
                Return: [{
                    CopyText: {
                        Data: `${Data}`
                    }
                }],
                ShiftClick: [{
                    CopyText: {
                        Data: DataFormatted
                    }
                }],
                ShiftReturn: [{
                    CopyText: {
                        Data: DataFormatted
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