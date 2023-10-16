import readline from "readline";
import config from "./app/configs/web.config";
import app from "./app/server";
import { Server } from "http";

// Запуск сервера
const port = process.env.PORT || config.port;
let server: Server;

// Функция для запуска сервера
function startServer(port: string | number) {
  server = app.listen(port, () => {
    const serverAddress = server.address();

    if (serverAddress && typeof serverAddress !== "string") {
      const { address, port } = serverAddress;
      const hostname = address === "::" ? "localhost" : address;
      console.log(
        "\x1b[32m%s\x1b[0m",
        `Server is running at http://${hostname}:${port}`
      );
    } else {
      console.log("\x1b[32m%s\x1b[0m", `Server is running on ${serverAddress}`);
    }
  });
}

// Функция для перезапуска сервера
function restartServer(port: string | number) {
  if (server) {
    server.close(() => {
      console.log("\x1b[33m%s\x1b[0m", "Server stopped");
      startServer(port);
    });
  } else {
    console.log("Server is not running, cannot restart.");
  }
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

startServer(port);

rl.on("line", (input) => {
  if (input === "stop") {
    rl.pause();
    rl.question(
      "Вы действительно хотите остановить сервер? (yes/no) ",
      (answer) => {
        if (answer.toLowerCase() === "yes") {
          process.emit("SIGINT");
        } else {
          rl.resume();
        }
      }
    );
  } else if (input === "restart") {
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
  } else {
    process.exit(0);
  }
});

rl.prompt();
