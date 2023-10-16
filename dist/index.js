"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const readline_1 = __importDefault(require("readline"));
const web_config_1 = __importDefault(require("./app/configs/web.config"));
const server_1 = __importDefault(require("./app/server"));
// Запуск сервера
const port = process.env.PORT || web_config_1.default.port;
let server;
// Функция для запуска сервера
function startServer(port) {
    server = server_1.default.listen(port, () => {
        const serverAddress = server.address();
        if (serverAddress && typeof serverAddress !== "string") {
            const { address, port } = serverAddress;
            const hostname = address === "::" ? "localhost" : address;
            console.log("\x1b[32m%s\x1b[0m", `Server is running at http://${hostname}:${port}`);
        }
        else {
            console.log("\x1b[32m%s\x1b[0m", `Server is running on ${serverAddress}`);
        }
    });
}
// Функция для перезапуска сервера
function restartServer(port) {
    if (server) {
        server.close(() => {
            console.log("\x1b[33m%s\x1b[0m", "Server stopped");
            startServer(port);
        });
    }
    else {
        console.log("Server is not running, cannot restart.");
    }
}
const rl = readline_1.default.createInterface({
    input: process.stdin,
    output: process.stdout,
});
startServer(port);
rl.on("line", (input) => {
    if (input === "stop") {
        rl.pause();
        rl.question("Вы действительно хотите остановить сервер? (yes/no) ", (answer) => {
            if (answer.toLowerCase() === "yes") {
                process.emit("SIGINT");
            }
            else {
                rl.resume();
            }
        });
    }
    else if (input === "restart") {
        rl.pause();
        restartServer(port);
    }
});
process.on("SIGINT", () => {
    // Закрыть сервер перед завершением процесса
    if (server) {
        server.close(() => {
            console.log("\x1b[33m%s\x1b[0m", "Server stopped");
            process.exit(0);
        });
    }
    else {
        process.exit(0);
    }
});
rl.prompt();
