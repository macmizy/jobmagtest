"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const responseService_1 = require("./responseService");
const SECRET_KEY = 'your-secret-key'; // Make sure this matches the key used in your main file
// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return responseService_1.ResponseService.errorResponse(res, 'Unauthorized: No token provided', 401);
    }
    jsonwebtoken_1.default.verify(token, SECRET_KEY, (err) => {
        if (err) {
            return responseService_1.ResponseService.errorResponse(res, 'Forbidden: Invalid token', 403);
        }
        next();
    });
};
exports.authenticateToken = authenticateToken;
