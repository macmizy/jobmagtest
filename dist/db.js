"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.savedJobs = exports.jobs = exports.testUser = void 0;
// Mock user data
exports.testUser = {
    username: 'testuser',
    password: 'password123'
};
// Mock job data
exports.jobs = [
    { id: "1", title: 'Software Engineer', type: 'full-time', remote: true },
    { id: "2", title: 'Frontend Developer', type: 'contract', remote: false },
    { id: "3", title: 'Backend Developer', type: 'full-time', remote: true },
];
// Memory saved jobs data
exports.savedJobs = [];
