export interface IResponse {
    data: any;
    message: string;
    code: number;
}

export interface IJob {
    id: string;  
    name: string;         
    title: string;      
    type: string;       
    remote: boolean;      
    company: string;       
    location: string;   
 
  }