"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const db_1 = __importDefault(require("./db"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const user_1 = __importDefault(require("./routes/user"));
const goal_1 = __importDefault(require("./routes/goal"));
const plan_1 = __importDefault(require("./routes/plan"));
const task_1 = __importDefault(require("./routes/task"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const passport_1 = __importDefault(require("passport"));
const app = (0, express_1.default)();
const PORT = process.env.PORT;
dotenv_1.default.config();
(0, db_1.default)();
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_URL,
    credentials: true,
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(passport_1.default.initialize());
app.use("/auth", authRoutes_1.default);
app.use("/api/user", user_1.default);
app.use("/api/goal", goal_1.default);
app.use("/api/plan", plan_1.default);
app.use("/api/task", task_1.default);
app.listen(PORT, () => {
    console.log("server is running");
});
