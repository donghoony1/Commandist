import { Interfaces } from '../interfaces';

const evil:Function = (fn: string): number => {
    try {
        return new Function('return ' + fn)();
    } catch(Exception) {
        return Exception;
    }
}

const number_format = (x: number): string => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

const application = (args: Array<string>): Interfaces.ApplicationStandardReturn => {
    const Data: number = evil((args[0] === 'calculator' ? args.slice(1, args.length) : args).join(''));
    const DataFormatted = number_format(Data);
    return [
        {
            ApplicationName: 'calculator',
            ApplicationIcon: {
                DefaultIcon: {
                    IconText: 'C',
                    IconColor: 'brightGreen'
                }
            },
            Output: {
                Default: {
                    Subject: DataFormatted,
                    Description: 'Return을 누르면 결과가 복사됩니다.'
                }
            },
            Event: {
                Click: [{
                    CopyText: {
                        Data
                    }
                }]
            }
        }
    ];
};

export { application };