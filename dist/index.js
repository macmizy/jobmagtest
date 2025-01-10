"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const controller_1 = require("./module/controller");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/api/v1', controller_1.JobController);
const PORT = process.env.PORT || 3000;
app.get('/', (req, res) => {
    res.send('Hello, TypeScript + Node.js!');
});
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
