import _ from 'lodash'
import chalk from 'chalk'

export default class Logger {

    static get ALLOWED_LEVELS() {
        return ['silent', 'error', 'info', 'warn', 'debug', 'verbose'];
    }

    static get DEFAULTS() {
        return {
            level: 'info',
            addDate: false,
            showColor: false,
        }
    }

    static get instance() {
        if (!this._instance) {
            this._instance = new Logger()
        }
        return this._instance
    }

    constructor({ level, addDate, showColor, prefix } = {}) {
        this._level = level
        this._addDate = addDate
        this._showColor = showColor
        this._prefix = prefix
    }

    get level() {
        let level = process.env.LOG_LEVEL ||
            this._level ||
            Logger.DEFAULTS.level
        level = level.toLowerCase()

        if (!this.levelIsValid(level))
            throw new Error(`Logger level ${level} not recognized.  Only allowed level values are ${this.constructor.ALLOWED_LEVELS}`);

        return level
    }

    levelIsValid(level) {
        return this.constructor.ALLOWED_LEVELS.includes(level)
    }

    get levelNumber() {
        return this.levelToNumber(this.level)
    }

    levelToNumber(level) {
        return {
            silent: 0,
            error: 100,
            warn: 200,
            info: 300,
            debug: 400,
            verbose: 500,
        }[level]
    }

    get addDate() {
        return process.env.LOG_ADD_DATE || this._addDate || Logger.DEFAULTS.addDate
    }

    get dateString() {
        return this.addDate ? new Date().toLocaleString() + ':' : ''
    }

    get showColor() {
        return process.env.LOG_SHOW_COLOR || this._showColor || Logger.DEFAULTS.showColor
    }

    get prefix() {
        return this._prefix || Logger.DEFAULTS.prefix
    }

    checking() {
        this._log(1, chalk.yellow, '###', ...arguments)
    }

    debug() {
        this._log('debug', chalk.magenta, 'DEBUG', ...arguments)
    }

    info() {
        this._log('info', chalk.greenBright, 'INFO', ...arguments)
    }

    warn() {
        this._log('warn', chalk.yellowBright, 'WARNING', ...arguments)
    }

    error() {
        this._log('error', chalk.redBright, 'ERROR', ...arguments)
    }

    show() {
        this._log(1, false, '', ...arguments)
    }

    shouldDisplay(level) {
        level = _.isNumber(level) ? level : this.levelToNumber(level)
        return this.levelNumber >= level
    }

    _log(level, color, prefix, ...messages) {
        if (!this.shouldDisplay(level)) return

        prefix = this.prefix || prefix

        const joinedStringOrNumbers = this.stringOrNumberMessages(messages).join(' ')

        if (color && this.showColor)
            console.log(color(prefix, this.dateString, joinedStringOrNumbers))
        else
            console.log(prefix, this.dateString, joinedStringOrNumbers)

        this.nonStringOrNumberMessages(messages).forEach(m => console.log(m), '\n');
    }

    isStringOrNumber(x) {
        return _.isString(x) || _.isNumber(x) || _.isBoolean(x) || _.isNaN(x)
    }
    stringOrNumberMessages(messages) {
        return messages.filter(m => this.isStringOrNumber(m))
    }

    nonStringOrNumberMessages(messages) {
        return messages.filter(m => !this.isStringOrNumber(m))
    }

    fatal() {
        this.error(arguments)
    }

}
