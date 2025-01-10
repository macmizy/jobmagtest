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
exports.Service = void 0;
const db_1 = require("../db");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const SECRET_KEY = process.env.SECRET;
class Service {
    // login
    static login(username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!username || !password) {
                    return { data: null, message: 'Username and password are required', code: 400 };
                }
                if (username === db_1.testUser.username && password === db_1.testUser.password) {
                    const token = jsonwebtoken_1.default.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
                    return { data: token, message: 'Login successful', code: 200 };
                }
                return { data: null, message: 'Invalid credentials', code: 401 };
            }
            catch (err) {
                return { data: null, message: err.message, code: 500 };
            }
            // Get all jobs
        });
    }
    // Get all jobs
    static getJobs(type, remote) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let filteredJobs = db_1.jobs;
                // Filter by job type if 'type' is provided
                if (type) {
                    filteredJobs = filteredJobs.filter((job) => job.type === type);
                }
                // Filter by remote status if 'remote' is provided
                if (remote !== undefined) {
                    // Convert 'remote' query parameter to a boolean value
                    const isRemote = remote === 'true'; // 'true' -> true, 'false' -> false
                    filteredJobs = filteredJobs.filter((job) => job.remote === isRemote);
                }
                // Return the filtered (or full) list of jobs
                return { data: filteredJobs, message: 'Jobs retrieved successfully', code: 200 };
            }
            catch (err) {
                return { data: null, message: err.message, code: 500 };
            }
        });
    }
    // Get jobs by id
    static getJobById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const job = db_1.jobs.find((job) => job.id === id);
                if (!job) {
                    return { data: null, message: 'Job not found', code: 404 };
                }
                return { data: job, message: 'Job retrieved successfully', code: 200 };
            }
            catch (err) {
                return { data: null, message: err.message, code: 500 };
            }
        });
    }
}
exports.Service = Service;
