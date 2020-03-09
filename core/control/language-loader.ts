import { Interfaces } from './interfaces';
import * as path from 'path';
import * as fs from 'fs';

const Load = (PreferedLanguage: Interfaces.LanguageTypeList): Interfaces.Language => {
    const Instruction: string = '\nPlease reinstall this program after backup \'applicationData\' and \'configurations\'.';
    const GetPath = (Language: Interfaces.LanguageTypeList): string => path.join(__dirname, '..', 'language', `${Language}.json`);
    if(!fs.existsSync(GetPath('ko-KR'))) {
        console.log('There is no default language.' + Instruction);
        process.exit();
    }
    let LanguageData: Interfaces.Language = JSON.parse(fs.readFileSync(GetPath('ko-KR'), 'utf-8'));
    if(PreferedLanguage !== 'ko-KR') {
        if(!fs.existsSync(GetPath(PreferedLanguage))) {
            console.log('There is no prefered language.' + Instruction);
            process.exit();
        }
        const PreferedLanguageData: Interfaces.Language = JSON.parse(fs.readFileSync(GetPath(PreferedLanguage), 'utf-8'));
        Object.assign(LanguageData, PreferedLanguageData);
    }
    return LanguageData;
}

export { Load };