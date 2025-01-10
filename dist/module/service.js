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
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const savedJobsFilePath = path_1.default.resolve(__dirname, 'savedJobs.json');
const SECRET_KEY = "secret-key";
class Service {
    // login
    static login(username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!username || !password) {
                    return { data: null, message: 'Username and password are required', code: 400 };
                }
                if (username === db_1.testUser.username && password === db_1.testUser.password) {
                    const token = jsonwebtoken_1.default.sign({ username }, SECRET_KEY, { expiresIn: '24h' });
                    return { data: token, message: 'Login successful', code: 200 };
                }
                return { data: null, message: 'Invalid credentials', code: 401 };
            }
            catch (err) {
                return { data: null, message: err.message, code: 500 };
            }
        });
    }
    // Get all jobs
    static getJobs(type, remote) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let filteredJobs = db_1.jobs;
                if (type) {
                    filteredJobs = filteredJobs.filter((job) => job.type === type);
                }
                if (remote !== undefined) {
                    const isRemote = remote === 'true'; // 'true' -> true, 'false' -> false
                    filteredJobs = filteredJobs.filter((job) => job.remote === isRemote);
                }
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
    // Save job
    static saveJob(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const job = db_1.jobs.find((job) => job.id === id);
                if (!job) {
                    return { data: null, message: 'Job not found', code: 404 };
                }
                // Read the existing saved jobs from the file
                let savedJobs = yield Service.readSavedJobsFromFile();
                if (savedJobs.some((savedJob) => savedJob.id === job.id)) {
                    return { data: null, message: 'Job is already saved', code: 400 };
                }
                savedJobs.push(job);
                yield Service.writeSavedJobsToFile(savedJobs);
                return { data: job, message: 'Job saved successfully', code: 200 };
            }
            catch (err) {
                return { data: null, message: err.message, code: 500 };
            }
        });
    }
    // Get saved jobs from the local file
    static getSavedJobs() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const savedJobs = yield Service.readSavedJobsFromFile();
                return { data: savedJobs, message: 'Saved jobs retrieved successfully', code: 200 };
            }
            catch (err) {
                return { data: null, message: err.message, code: 500 };
            }
        });
    }
    static readSavedJobsFromFile() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Check if the file exists
                if (!fs_1.default.existsSync(savedJobsFilePath)) {
                    return [];
                }
                // Read the file content
                const fileContent = yield fs_1.default.promises.readFile(savedJobsFilePath, 'utf-8');
                return JSON.parse(fileContent);
            }
            catch (err) {
                throw new Error('Error reading saved jobs from file: ' + err.message);
            }
        });
    }
    //  method to write saved jobs to the file
    static writeSavedJobsToFile(savedJobs) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Convert saved jobs array to JSON
                const fileContent = JSON.stringify(savedJobs, null, 2);
                yield fs_1.default.promises.writeFile(savedJobsFilePath, fileContent, 'utf-8');
            }
            catch (err) {
                throw new Error('Error writing saved jobs to file: ' + err.message);
            }
        });
    }
    // Job summary
    static jobSummary() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const savedJobs = yield Service.readSavedJobsFromFile();
                const totalJobs = db_1.jobs.length;
                const totalSavedJobs = savedJobs.length;
                const summary = db_1.jobs.reduce((acc, job) => {
                    // Count by job type
                    acc.jobType[job.type] = (acc.jobType[job.type] || 0) + 1;
                    // Count by location
                    acc.location[job.location] = (acc.location[job.location] || 0) + 1;
                    // Count by remote status
                    const remoteKey = job.remote ? "remote" : "on-site";
                    acc.remote[remoteKey] = (acc.remote[remoteKey] || 0) + 1;
                    return acc;
                }, {
                    jobType: {},
                    location: {},
                    remote: {},
                });
                return {
                    data: {
                        totalJobs,
                        totalSavedJobs,
                        summary,
                    },
                    message: "Job summary retrieved successfully",
                    code: 200,
                };
            }
            catch (err) {
                return { data: null, message: err.message, code: 500 };
            }
        });
    }
}
exports.Service = Service;
