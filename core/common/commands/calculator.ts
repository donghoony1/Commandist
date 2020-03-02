const evil:Function = (fn: string): number => {
    try {
        return new Function('return ' + fn)();
    } catch(Exception) {
        return Exception;
    }
}

const application = (args: Array<string>): number => {
    return evil((args[0] === 'calculator' ? args.slice(1, args.length) : args).join(''));
};

export { application };