import express from 'express';
import { JobController } from './module/controller';



const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.use('/api/v1', JobController);
  
const PORT =  3000;

app.get('/', (req, res) => {
  res.send('Hello, TypeScript + Node.js!');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});