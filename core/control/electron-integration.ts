const ReverseString = (string: string): string => string.split('').reverse().join('');
const GetNthIndex = (string: string, find: string, nth: number = 1, reverse: Boolean = false): number => {
    string = reverse ? ReverseString(string) : string;
    const strlen = string.length, finlen = find.length;
    let i, n = 1, found = false;
    for(i = 0; i < strlen; i++) {
        if(string.substring(i, i + finlen) === find) {
            if(nth === n) {
                found = true;
                break;
            } else n++;
        }
    }
    return found ? (reverse ? strlen - finlen - i : i) : -1;
}
const dirname = __dirname.replace(/\\/g, '/');
const BaseDir: string = /Commandist\.exe$/.test(process.argv[0]) === true ? dirname.substring(0, GetNthIndex(dirname, '/', 4, true)) : dirname.substring(0, GetNthIndex(dirname, '/', 2, true));
const CoreDir: string = dirname.substring(0, GetNthIndex(dirname, '/', 1, true));

export { BaseDir, CoreDir };