"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Commander = void 0;
const path = require("path");
const util_1 = require("util");
const glob = require("glob");
const fs_1 = require("fs");
const command_1 = require("./command");
const errors_1 = require("../errors");
const findFiles = util_1.promisify(glob);
function existDirectory(dir) {
    return fs_1.promises.access(dir)
        .then(() => true).catch(() => false);
}
/**
 * @description класс обработки
 * @class
 */
class Commander {
    constructor() {
        /**
         * @property {Array<Command>} commands массив команд
         */
        this.commands = [];
        this.commandsLoaded = false;
        return this;
    }
    /**
     * @description загрузка команд
     * @param {string} dir директория загрузки команд
     * @returns {Promise<void>}
     */
    async loadFromDirectory(dir) {
        try {
            const existDir = await existDirectory(dir);
            if (!existDir) {
                throw new errors_1.ConfigureError(`${dir} не существует`);
            }
            const absPath = path.resolve(dir);
            const filePaths = await findFiles(`${absPath}/**/*.js`);
            for (const filePath of filePaths) {
                let file = await Promise.resolve().then(() => __importStar(require(filePath)));
                file = file.default ? file.default : file;
                if (!Array.isArray(file)) {
                    file = [file];
                }
                if (file.length === 0) {
                    continue;
                }
                for (const com of file) {
                    if (!(com instanceof command_1.Command)) {
                        throw new errors_1.ConfigureError(`Экспартируемые данные в файле ${filePath} не являются командой`);
                    }
                    this.commands.push(com);
                }
            }
        }
        catch (err) {
            this.commandsLoaded = false;
        }
    }
    /**
     * @description поиск команды
     * @param {any} context
     * @returns {Command}
     * @example ts
     *
     * import { MessageContext } from "vk-io";
     *
     * const command = commander.find<MessageContext>(context)
     */
    find(context) {
        let command;
        for (const com of this.commands) {
            if (com.pattern.test(context.command)) {
                command = com;
                break;
            }
        }
        if (!command) {
            return null;
        }
        context.body = context.command.match(command.pattern);
        if (command.commands.length) {
            command = command.findSubCommand(context);
        }
        return command;
    }
}
exports.Commander = Commander;
