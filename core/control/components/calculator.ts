import { Interfaces } from '../interfaces';

const ApplicationName: string = 'calculator';

const evil:Function = (fn: string): number => {
    try {
        return new Function('return ' + fn)();
    } catch(Exception) {
        return Exception;
    }
}

const number_format = (x: number): string => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

const application = (MS: Interfaces.ModuleSuite, args: Array<string>): Interfaces.ApplicationStandardReturn => {
    const Data: number = evil((args[0] === ApplicationName ? args.slice(1, args.length) : args).join(''));
    if(isNaN(Data)) {
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
                        Subject: '오류가 발생했습니다.',
                        Description: '유효한 수식을 입력하세요.'
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
            Name: ApplicationName,
            Icon: {
                FontAwesome: {
                    Icon: 'calculator-alt',
                    Type: 'duotone'
                },
                DefaultIcon: {
                    IconText: ApplicationName.toUpperCase(),
                    IconColor: 'brightGreen'
                }
            },
            Output: {
                Default: {
                    Subject: DataFormatted,
                    Description: '결과를 복사하려면 Return을 누르세요.'
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

export { application };