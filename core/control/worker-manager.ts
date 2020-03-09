
import * as ChildProcess from 'child_process';
import { Interfaces } from './interfaces';
import * as path from 'path';

class Control_WorkerManager {
    private Workers: Interfaces.Workers;

    constructor() {
        this.Workers = {
            LauncherV1: ChildProcess.spawn('node', [ path.join('core', 'service', 'launcher') ], { cwd: path.join(__dirname, '..', '..', `${ process.env.build === 'application' ? '../app.asar.unpacked' : '' }`) })
        };
    }
}

export { Control_WorkerManager };