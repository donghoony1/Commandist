# The Commandist
An accelerator of all work speeds.

# ⚠ Cautions
- This project is still under development.
    - It may not work.
    - The structure and the code may be changed.
    - There may be a security problems.

# 🔧 Development
## TODOs
- Make a script to build Electron as Windows Application.
- Change the structure of core for multilingual support.
- Add support components which are made by user.
- Add a feature to modify the placeholder on QuickCommand.
- Add a support to return asynchronous result.
- Add a support to display dialog.

## Components
### Default
- Convert currency `convert-currency`, `cc`
    - Examples: `100 USD KRW`, `$1`, `\1200`
- Convert unit `convert-unit`, `cu`
    - Examples: `1kg to g`, `1m to cm`, `1GB to Gb`, `1TB to GB`
- OS Interaction `os-interaction`, `OI`
    - Examples: `shutdown`, `sleep`, `suspend`, `restart`, `reboot`, `halt`
- Translation
    - Google Translate `translate-google`, `tg`
        - Examples: `tg EN KR Hello, world!`, `tg KR EN 안녕!`
    - NAVER Papago `translate-papago`, `np`
        - Examples: `np EN KR Hello, world!`, `np KR EN 안녕!`
- Terminal Execution `terminal-execution`, `>`
    - Examples: `> mkdir "~/I am a folder"`, `> node test.js`
- System monitor `system-monitor`, `sm`
    - Example: `sm`, `sm cpu`, `sm load`, `sm memory`, `sm uptime`, `sm arch`, `sm platform`, `sm type`, `sm hostname`, `sm nic`
- Change welcome message `change-welcome-message`, `cm`
    - Example: `cm Hello, ${hostname}!`, `cm 환영합니다 ${username}님!`, `cm ${username}님, 좋은 하루 되세요!`

### Add-on
- AWS CLI Driver: `driver-aws-cli`, `aws`
    - Examples: `aws lightsail get-instances`, `aws lightsail get-instance --instance-name Test`
- Hyper-V Driver: `driver-hyper-v`, `hyperv`
    - Examples: `hyperv new-vm -vmname Test`, `hyperv start-vm -vmname Test`
- Inline JavaScript Execution: `execution-js-execution`, `nodejs`
    - Examples: `nodejs console.log('1 + 1 = ' + 2)`, `nodejs const os = require('os'); console.log(os.arch())`
- Inline PHP 7 Execution: `execution-php-7` `php7`
    - Examples: `php7 echo('1 + 1 = ' . 2)`, `php7 echo($_SERVER['remote_addr'])`
- Timer: `timer`
    - Examples: `timer 5s`, `timer 5m`
- Alarm: `alarm`
    - Examples: `alarm 0 0 */1 * * *`, `alarm 0 */15 * * *`
- Stopwatch: `stopwatch`
    - Examples: `stopwatch start English Reading`, `stopwatch list`, `stopwatch stop English Reading`, `stopwatch pause English Reading`, `stopwatch English Reading`
- World time: `world-time`, `t`
    - Examples: `t`, `t all`, `t Asia/Seoul`, `t +9`

# Contributors
- Jeongmin Kim `Translation`
    - E-Mail: [appff13@gmail.com](mailto:appff13@gmail.com)