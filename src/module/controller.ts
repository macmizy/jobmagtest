import { authenticateToken } from "../middleware/auth";
import express from "express";
import { Request, Response } from "express";
import {Service} from "./service";
import { ResponseService } from "../middleware/responseService";


export const JobController = express.Router();
// User Login
JobController.post('/login', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const {data, message, code} = await Service.login(username, password);
    ResponseService.successResponse(res, data, message, code);
    } catch (err: any) {
        ResponseService.errorResponse(res, err.message, 500);
    }
});

// get all jobs 
JobController.get('/jobs', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { type, remote } = req.query;
    const {data, message, code} = await Service.getJobs(type as string, remote as string);
    ResponseService.successResponse(res, data, message, code);
  } catch (err: any) {
    ResponseService.errorResponse(res, err.message, 500);
  }
});
// save a job 
JobController.post('/jobs/save/:id', authenticateToken, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const {data, message, code} = await Service.saveJob(id);
      ResponseService.successResponse(res, data, message, code);
    } catch (err: any) {
      ResponseService.errorResponse(res, err.message, 500);
    }
  });

  
  // retrieve saved jobs
JobController.get('/jobs/saved',authenticateToken, async (req: Request, res: Response) => {
    try {
      const {data, message, code} = await Service.getSavedJobs();
      ResponseService.successResponse(res, data, message, code);
    } catch (err: any) {
      ResponseService.errorResponse(res, err.message, 500);
    }
  });

// job summary
JobController.get('/jobs/summary', authenticateToken, async (req: Request, res: Response) => {
    try {
      const {data, message, code} = await Service.jobSummary();
      ResponseService.successResponse(res, data, message, code);
    } catch (err: any) {
      ResponseService.errorResponse(res, err.message, 500);
    }
  });


  //get jobs by Id 
  JobController.get('/jobs/:id', authenticateToken, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const {data, message, code} = await Service.getJobById(id);
      ResponseService.successResponse(res, data, message, code);
    } catch (err: any) {
      ResponseService.errorResponse(res, err.message, 500);
    }
  });