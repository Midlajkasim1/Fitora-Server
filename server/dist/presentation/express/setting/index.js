"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const connect_db_1 = require("@/infrastructure/database/mongoose/connect.db");
const app_1 = __importDefault(require("./app"));
require("dotenv/config");
const PORT = process.env.PORT || 4000;
const startServer = async () => {
    await connect_db_1.DatabaseService.connect();
    app_1.default.listen(PORT, () => {
        console.log(`Server started on http://localhost:${PORT}`);
    });
};
startServer();
