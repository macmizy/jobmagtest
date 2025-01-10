"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseService = void 0;
class ResponseService {
    static successResponse(res, data, message, code) {
        return res.status(code).json({
            success: true,
            message,
            data,
        });
    }
    static errorResponse(res, message, code) {
        return res.status(code).json({
            success: false,
            message,
            data: null,
        });
    }
}
exports.ResponseService = ResponseService;
