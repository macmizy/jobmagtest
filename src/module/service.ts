import {testUser, jobs} from '../db';
import jwt from 'jsonwebtoken';
import { IResponse, IJob } from './interface';
import fs from 'fs';
import path from 'path';

const savedJobsFilePath = path.resolve(__dirname, 'savedJobs.json');


const SECRET_KEY = "secret-key"

export class Service {
    // login
    static async login(username: string, password: string): Promise<IResponse> {
      try{
        if (!username || !password) {
            return {data: null, message: 'Username and password are required', code: 400};
            } 
        if (username === testUser.username && password === testUser.password) {
            const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '24h' });
            return {data: token, message: 'Login successful', code: 200};
          }
            return {data: null, message: 'Invalid credentials', code: 401};

      }catch(err: any){
          return {data: null, message: err.message, code: 500};
    }
    }

    // Get all jobs
    static async getJobs(type: string, remote: string): Promise<IResponse> {
    try{
      let filteredJobs = jobs; 
      
      if (type) {
        filteredJobs = filteredJobs.filter((job) => job.type === type);
      }

      if (remote !== undefined) {
       
        const isRemote = remote === 'true'; // 'true' -> true, 'false' -> false
        filteredJobs = filteredJobs.filter((job) => job.remote === isRemote);
      }

      return {data: filteredJobs, message: 'Jobs retrieved successfully', code: 200};
    }
    catch(err: any){
      return {data: null, message: err.message, code: 500};
    }
  }
  
    
    // Get jobs by id

    static async getJobById(id: string): Promise<IResponse> {
      try{
        const job = jobs.find((job) => job.id === id);
        if (!job) {
          return {data: null, message: 'Job not found', code: 404};
        }
        return {data: job, message: 'Job retrieved successfully', code: 200};
      }catch(err: any){
        return {data: null, message: err.message, code: 500};
      }
    }
    
    // Save job
    static async saveJob(id: string): Promise<IResponse> {
      try {
        const job = jobs.find((job) => job.id === id);
        if (!job) {
          return { data: null, message: 'Job not found', code: 404 };
        }
  
        // Read the existing saved jobs from the file
        let savedJobs = await Service.readSavedJobsFromFile();
  

        if (savedJobs.some((savedJob) => savedJob.id === job.id)) {
          return { data: null, message: 'Job is already saved', code: 400 };
        }
  
        savedJobs.push(job);

        await Service.writeSavedJobsToFile(savedJobs);
  
        return { data: job, message: 'Job saved successfully', code: 200 };
      } catch (err: any) {
        return { data: null, message: err.message, code: 500 };
      }
    }
  
    // Get saved jobs from the local file
    static async getSavedJobs(): Promise<IResponse> {
      try {
        const savedJobs = await Service.readSavedJobsFromFile();
        return { data: savedJobs, message: 'Saved jobs retrieved successfully', code: 200 };
      } catch (err: any) {
        return { data: null, message: err.message, code: 500 };
      }

    }
      private static async readSavedJobsFromFile(): Promise<IJob[]> {
        try {
          // Check if the file exists
          if (!fs.existsSync(savedJobsFilePath)) {
            return [];
          }
          
          // Read the file content
          const fileContent = await fs.promises.readFile(savedJobsFilePath, 'utf-8');
          return JSON.parse(fileContent);
        } catch (err: any ) {
          throw new Error('Error reading saved jobs from file: ' + err.message);
        }
      }
    
      //  method to write saved jobs to the file
      private static async writeSavedJobsToFile(savedJobs: IJob[]): Promise<void> {
        try {
          // Convert saved jobs array to JSON
          const fileContent = JSON.stringify(savedJobs, null, 2);
          await fs.promises.writeFile(savedJobsFilePath, fileContent, 'utf-8');
        } catch (err: any) {
          throw new Error('Error writing saved jobs to file: ' + err.message);
        }
      }

    
   
    // Job summary
static async jobSummary(): Promise<IResponse> {
  try {
  
    const savedJobs = await Service.readSavedJobsFromFile();

    const totalJobs = jobs.length; 
    const totalSavedJobs = savedJobs.length; 

    
    const summary = jobs.reduce(
      (acc, job) => {
        // Count by job type
        acc.jobType[job.type] = (acc.jobType[job.type] || 0) + 1;

        // Count by location
        acc.location[job.location] = (acc.location[job.location] || 0) + 1;

        // Count by remote status
        const remoteKey = job.remote ? "remote" : "on-site";
        acc.remote[remoteKey] = (acc.remote[remoteKey] || 0) + 1;

        return acc;
      },
      {
        jobType: {} as Record<string, number>,
        location: {} as Record<string, number>,
        remote: {} as Record<string, number>,
      }
    );

    return {
      data: {
        totalJobs,
        totalSavedJobs,
        summary,
      },
      message: "Job summary retrieved successfully",
      code: 200,
    };
  } catch (err: any) {
    return { data: null, message: err.message, code: 500 };
  }
}

   

}