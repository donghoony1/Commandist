import { Interfaces } from '../../interfaces';
import * as fs from 'fs';
import { app, BrowserWindow, ipcMain } from 'electron';

const ApplicationName: string = 'launcher';
let ApplicationCompatible: Array<string> = [];

let Applications: Array<Interfaces.LauncherV1ApplicationsWin32> = [];

const init = (MS: Interfaces.ModuleSuite, callback: Function): void => {
    ApplicationCompatible = MS.Configuration['QuickCommand.v1.component.default.launcher.v1.feature.compatible'];

    if(!ApplicationCompatible.includes(process.platform)) return;

    const IconCachePath: string = `./applicationData/Launcher.v1/Icons/${ process.platform }`;

    const Load = (): void => {
        if(fs.existsSync(`${ IconCachePath }/${ process.platform }.json`)) Applications = JSON.parse(fs.readFileSync(`${ IconCachePath }/${ process.platform }.json`, 'utf-8'));
    }

    Load();

    const app = require('child_process').spawn('node', [ './core/service/launcher.v1.component.js' ]);
    app.stdout.on('data', (data: any): void => {
        console.log(`'${ data.toString() }`);

        const dataInline: string = data.toString().split('\n')[0];
        if(/^FullScan-(Start|Finish)$/.test(dataInline)) callback(null, { 'QuickCommand.SetIndexingState': dataInline === 'FullScan-Start' ? true : false });

        if(/Scan-Finish$/.test(data.toString())) Load();
    });
    app.stderr.on('data', (data: any): void => console.log(data.toString()));
    app.on('close', (data: any): void => console.log(data.toString()));
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
                        Subject: MS.Language['Commandist.v1.control.QuickCommand.v1.component.launcher.return.notsupported.subject'],
                        Description: MS.Language['Commandist.v1.control.QuickCommand.v1.component.launcher.return.notsupported.description'].replace(/\${ApplicationCompatible}/, ApplicationCompatible.join(', '))
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
                ImageFilePath: `../../../../applicationData/Launcher.v1/Icons/${ process.platform }/${ Application.IconPath }`,
                DefaultIcon: {
                    IconText: ApplicationName.toUpperCase(),
                    IconColor: 'brightPurple'
                }
            },
            Output: {
                Default: {
                    Subject: Application.Name,
                    Description: MS.Language['Commandist.v1.control.QuickCommand.v1.component.launcher.return.description']
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