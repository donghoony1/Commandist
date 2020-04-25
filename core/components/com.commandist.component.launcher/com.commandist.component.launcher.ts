import { Interfaces } from '../../control/interfaces';
import * as path from 'path';
import * as fs from 'fs';

const Language: Interfaces.ComponentLanguage = {
    'ko-KR': {
        'return.notsupported.subject': '이 플랫폼은 지원하지 않습니다.',
        'return.notsupported.description': '지원하는 플랫폼: ${ApplicationCompatible}',
        'return.description': '실행하려면 Return을 누르세요.'
    }
};

const Component: Interfaces.Component = {
    ID: 'com.commandist.component.launcher',
    Name: 'Launcher',
    Description: 'An internal component for Commandist.',
    CallSign: 'launcher',
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

let ApplicationCompatible: Array<string> = [ 'win32' ];
let Applications: Array<Interfaces.LauncherV1ApplicationsWin32> = [];

const Init = (callback: Function): void => {
    if(!ApplicationCompatible.includes(process.platform)) return;

    const IconCachePath: string = path.join(__dirname, '..', '..', '..', process.env.build === 'application' ? '..' : '', 'applicationData', 'Launcher.v1', 'Icons', process.platform);

    const Load = (): void => {
        if(fs.existsSync(path.join(IconCachePath, `${ process.platform }.json`))) {
            Applications = JSON.parse(fs.readFileSync(path.join(IconCachePath, `${ process.platform }.json`), 'utf-8'));
            callback(null, { SetIndexingState: false });
        }
    }

    Load();
    setInterval(Load, 5000);
}

const Execute = (LanguagePreference: string, args: Array<string>): Interfaces.ApplicationStandardReturn => {
    const L: Interfaces.Language = Language[LanguagePreference];

    const Keyword: string = (args[0] === Component.CallSign ? args.slice(1, args.length) : args).join(' ');
    if(!ApplicationCompatible.includes(process.platform)) {
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
                        Subject: L['return.notsupported.subject'],
                        Description: L['return.notsupported.description'].replace(/\${ApplicationCompatible}/, ApplicationCompatible.join(', '))
                    }
                },
                Event: {},
                Error: true,
                DefaultApp: true
            }
        ];
    }
    return Applications.filter((Application): Boolean => Application.Name.toLowerCase().indexOf(Keyword.toLowerCase()) !== -1).map((Application): Interfaces.ApplicationStdReturnInstance => (
        {
            Name: Component.Name,
            Icon: {
                ImageFilePath: `../../../../${ process.env.build === 'application' ? '../' : '' }applicationData/Launcher.v1/Icons/${ process.platform }/${ Application.IconPath }`,
                DefaultIcon: {
                    IconText: Component.Name.toUpperCase(),
                    IconColor: 'brightPurple'
                }
            },
            Output: {
                Default: {
                    Subject: Application.Name,
                    Description: L['return.description']
                }
            },
            Event: {
                Click: [{
                    OpenExternal: {
                        URI: Application.ActualPath
                    }
                }],
                Return: [{
                    OpenExternal: {
                        URI: Application.ActualPath
                    }
                }],
                ShiftClick: [{
                    OpenExternal: {
                        URI: Application.ActualPath
                    }
                }],
                ShiftReturn: [{
                    OpenExternal: {
                        URI: Application.ActualPath
                    }
                }]
            },
            Error: false,
            DefaultApp: true
        }
    ));
};

let Configuration: Interfaces.Configuration = {};
const ConfigurationInit = (GivenConfiguration: Interfaces.Configuration) => Configuration = GivenConfiguration;
export { Component, Init, Execute, Configuration, ConfigurationInit };