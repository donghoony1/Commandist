import * as ConfigurationManager from '../control/configuration-manager';
import { Interfaces } from '../control/interfaces';
import * as ChildProcess from 'child_process';
import { Md5 } from 'ts-md5/dist/md5';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';

const IconExtractor = require(`${ process.env.build === 'application' ? '../../node_modules/' : '' }@donghoonyoo/icon-extractor`);

const ApplicationName: string = 'launcher';
let ApplicationCompatible: Array<string> = [];

const Configuration: Interfaces.Configuration = ConfigurationManager.Load();

ApplicationCompatible = Configuration['QuickCommand.v1.component.default.launcher.v1.feature.compatible'] as Array<string>;
if(!ApplicationCompatible.includes(process.platform)) process.exit;

IconExtractor.emitter.on('icon', (data: { Context: string | number | Buffer | import("url").URL; Base64ImageData: any; }) => {
    fs.writeFileSync(data.Context, Buffer.from(data.Base64ImageData, 'base64'));
});

const UpdateCacheData = (Paths: Array<string>, Refresh: Boolean) => {
    const IconCachePath: string = path.join(__dirname, '..', '..', process.env.build === 'application' ? '..' : '', 'applicationData', 'Launcher.v1', 'Icons', process.platform);
    switch(process.platform) {
        case 'win32': {
            if(!fs.existsSync(IconCachePath)) fs.mkdirSync(IconCachePath, { recursive: true });

            let Applications: Array<Interfaces.LauncherV1ApplicationsWin32> = [];



            // Add Explorer.exe
            Applications.push({
                Name: 'Explorer',
                ActualPath: `${ os.homedir().substring(0, 1) }:\\Windows\\explorer.exe`,
                IconPath: new Md5().appendStr('Explorer.exe').end() as string + '.ico',
                AppX: false
            });



            // Collect legacy applications.
            const getApplicationsList = (path: string): Array<string> => {
                let output: Array<string> = [];
                fs.readdirSync(path).forEach((program): void => {
                    if(!(/\.[A-Za-z]+/).test(program)) output = [ ...output, ...getApplicationsList(`${path}\\${program}`) ];
                    else output.push(`${ path }\\${ program }`);
                });
                return output;
            }
            Paths.forEach((Path) => {
                Applications = [ 
                    ...Applications, 
                    ...getApplicationsList(Path).map((program): Interfaces.LauncherV1ApplicationsWin32 => ({
                        Name: program.substring(program.lastIndexOf('\\') + 1, program.lastIndexOf('.')),
                        ActualPath: ChildProcess.spawnSync('powershell.exe', [ `-c`, `(New-Object -COM WScript.Shell).CreateShortcut("${ program }").TargetPath` ]).output[1].toString().replace(/\r\n/g, ''),
                        //ActualPath: shell.readShortcutLink('program').target,
                        IconPath: new Md5().appendStr(program).end() as string + '.ico',
                        AppX: false
                    })).filter((program) => /^[A-Z]:.+\\.+\.(exe|EXE)$/.test(program.ActualPath))
                ];
            });
            Applications.filter((program): Boolean => {
                // try {
                //     console.log(program);
                //     if(!fs.existsSync(path.join(IconCachePath, program.IconPath)) && Refresh === true) fs.writeFileSync(path.join(IconCachePath, program.IconPath), extractIcon(program.ActualPath, 'large'));
                //     return true;
                // } catch(Exception) {
                //     console.log(program, Exception);
                // }
                IconExtractor.getIcon(path.join(IconCachePath, program.IconPath), program.ActualPath);
                return false;
            });



            // Collect applications on Universal Windows Platform(UWP).
            interface Temporary1 {
                InstallLocation: string,
                PackageFamilyName: string
            }

            // Get applications from PowerShell and filter required rows.
            const AppX = JSON.parse(
                ChildProcess
                .execSync('powershell.exe /c "get-appxpackage | select InstallLocation,PackageFamilyName | convertto-json"')
                .toString()
                .replace(/\\r\\n/, '')
            )

            // Filter invalid applications by checking whether there is appxmanifest.xml or not.
            .filter((Application: Temporary1): Boolean => (
                fs.existsSync(path.join(Application.InstallLocation, 'appxmanifest.xml'))
            ))

            // Trim up the informations of applications.
            .map((Application: Temporary1): Interfaces.LauncherV1ApplicationsWin32 => {
                const AppxManifest: string = fs.readFileSync(path.join(Application.InstallLocation, 'appxmanifest.xml'), 'utf-8');

                const Name: any = /<DisplayName>(.+)<\/DisplayName>/.exec(AppxManifest);

                let ApplicationID: any = /<Application Id="([^"]+)"/.exec(AppxManifest);
                ApplicationID = ApplicationID === null ? 'N/A' : ApplicationID[1];

                let Logo: any = /<Logo>(.+)<\/Logo>/.exec(AppxManifest);
                Logo = Logo === null ? 'N/A' : path.join(Application.InstallLocation, Logo[1]);

                if(Logo !== 'N/A' && !fs.existsSync(Logo)) {
                    const LastDelimiter: number = Math.max(Logo.lastIndexOf('\\'), Logo.lastIndexOf('/'));

                    const TemporaryFilePrefix: string = Logo.substring(LastDelimiter + 1, Logo.lastIndexOf('.'));
                    const Assets: string = Logo.substring(0, LastDelimiter);

                    if(fs.existsSync(Assets)) Logo = `${ Assets }\\${ fs.readdirSync(Assets).filter((TemporaryPath: string) => TemporaryPath.substring(0, TemporaryFilePrefix.length) === TemporaryFilePrefix).sort((a, b) => fs.statSync(path.join(Assets, b)).size - fs.statSync(path.join(Assets, a)).size)[0] }`;
                    else Logo = 'N/A';
                }

                return {
                    Name: Name === null ? 'N/A' : ((Configuration['QuickCommand.v1.component.default.launcher.v1.service.win32.universal-windows-platform.dictionary'] as { [key: string]: string })[Name[1]] || Name[1]),
                    ActualPath: ApplicationID === 'N/A' ? 'N/A' : `shell:appsFolder\\${ Application.PackageFamilyName }!${ ApplicationID }`,
                    IconPath: Logo,
                    AppX: true
                };
            })
            .filter((Application: Interfaces.LauncherV1ApplicationsWin32): Boolean => (
                Application.Name !== 'N/A' 
                && Application.ActualPath !== 'N/A' 
                && Application.IconPath !== 'N/A'
            ))

            // Filter the applications on blacklist
            .filter((Application: Interfaces.LauncherV1ApplicationsWin32): Boolean => (
                !(Configuration['QuickCommand.v1.component.default.launcher.v1.service.win32.universal-windows-platform.blacklist'] as Array<string>).some((Blacklist: string): Boolean => (
                    Application.Name.length < Blacklist.length 
                    ? Blacklist.substring(0, Application.Name.length) === Application.Name 
                    : Application.Name.substring(0, Blacklist.length) === Blacklist
                ))
            ))

            // Copy the image of icon to applicationData.
            .map((Application: Interfaces.LauncherV1ApplicationsWin32): Interfaces.LauncherV1ApplicationsWin32 => {
                const IconPath = (new Md5().appendStr(Application.IconPath).end() as string) + Application.IconPath.substring(Application.IconPath.lastIndexOf('.'));

                if(fs.existsSync(Application.IconPath)) {
                    try {
                        if(!fs.existsSync(path.join(IconCachePath, IconPath)) && Refresh === true) fs.copyFileSync(Application.IconPath, path.join(IconCachePath, IconPath));
                    } catch(Exception) {
                        Application.Name === 'N/A';
                    }
                } else Application.Name === 'N/A';

                return {
                    Name: Application.Name,
                    ActualPath: Application.ActualPath,
                    AppX: Application.AppX,
                    IconPath
                }
            })
            .filter((Application: Interfaces.LauncherV1ApplicationsWin32): Boolean => (
                Application.Name !== 'N/A'
            ));

            Applications = [ ...Applications, ...AppX ];

            fs.writeFileSync(path.join(IconCachePath, 'win32.json'), JSON.stringify(Applications));
            
            fs.readdirSync(IconCachePath).filter((Icon) => Icon !== `${ process.platform }.json`).forEach((Icon) => {
                if(Applications.find((Application) => Application.IconPath === Icon) === undefined) fs.unlinkSync(path.join(IconCachePath, Icon));
            });
        }
    }

    setTimeout(() => UpdateCacheData(Paths, !Refresh), Configuration['QuickCommand.v1.component.default.launcher.v1.service.cache.updatinginterval'] as number || 300000);
}
UpdateCacheData([
    'C:\\ProgramData\\Microsoft\\Windows\\Start Menu\\Programs',
    `${ os.homedir() }\\AppData\\Roaming\\Microsoft\\Windows\\Start Menu\\Programs`
], true);