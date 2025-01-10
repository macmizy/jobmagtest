"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobController = void 0;
const auth_1 = require("../middleware/auth");
const express_1 = __importDefault(require("express"));
const service_1 = require("./service");
const responseService_1 = require("../middleware/responseService");
exports.JobController = express_1.default.Router();
// User Login
exports.JobController.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        const { data, message, code } = yield service_1.Service.login(username, password);
        return responseService_1.ResponseService.successResponse(res, data, message, code);
    }
    catch (err) {
        return responseService_1.ResponseService.errorResponse(res, err.message, 500);
    }
}));
// get all jobs 
exports.JobController.get('/jobs', auth_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { type, remote } = req.query;
        const { data, message, code } = yield service_1.Service.getJobs(type, remote);
        return responseService_1.ResponseService.successResponse(res, data, message, code);
    }
    catch (err) {
        return responseService_1.ResponseService.errorResponse(res, err.message, 500);
    }
}));
//get jobs by Id 
// save a job 
// retrieve saved jobs
// job summary
