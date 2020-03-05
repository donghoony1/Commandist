import { Interfaces } from '../interfaces';
import * as fs from 'fs';

const ApplicationName: string = 'launcher';
let ApplicationCompatible: Array<string> = [];

let Applications: Array<Interfaces.LauncherV1Applications> = [];

const init = (MS: Interfaces.ModuleSuite): void => {
    ApplicationCompatible = MS.Configuration['QuickCommand.v1.components.default.launcher.v1.feature.compatible'];

    if(!ApplicationCompatible.includes(process.platform)) return;

    const app = require('child_process').spawn('node', [ './core/service/launcher.v1.component.js' ]);
    app.stdout.on('data', (data: any): void => console.log(data.toString()));
    app.stderr.on('data', (data: any): void => console.log(data.toString()));
    app.on('close', (data: any): void => console.log(data.toString()));

    const IconCachePath: string = `./applicationData/Launcher.v1/Icons/${ process.platform }`;
    setTimeout((): void => {
        if(fs.existsSync(`${ IconCachePath }/${ process.platform }.json`)) Applications = JSON.parse(fs.readFileSync(`${ IconCachePath }/${ process.platform }.json`, 'utf-8'));
    }, 1000);
}

const application = (MS: Interfaces.ModuleSuite, args: Array<string>): Interfaces.ApplicationStandardReturn => {
    const Keyword: string = (args[0] === ApplicationName ? args.slice(1, args.length) : args).join(' ');
    if(!ApplicationCompatible.includes(process.platform)) {
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
                        Subject: '이 플랫폼은 지원하지 않습니다.',
                        Description: `지원하는 플랫폼: ${ ApplicationCompatible.join(', ') }`
                    }
                },
                Event: {},
                Error: true,
                DefaultApp: true
            }
        ];
    }
    return Applications.filter((Application): Boolean => Application.Name.toLowerCase().indexOf(Keyword) !== -1).map((Application): Interfaces.ApplicationStdReturnInstance => (
        {
            Name: ApplicationName,
            Icon: {
                ImageFilePath: `../../../../applicationData/Launcher.v1/Icons/${ process.platform }/${ Application.LnkPathMD5 }.ico`,
                DefaultIcon: {
                    IconText: ApplicationName.toUpperCase(),
                    IconColor: 'brightPurple'
                }
            },
            Output: {
                Default: {
                    Subject: Application.Name,
                    Description: '실행하려면 Return을 누르세요.'
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

export { init, application };