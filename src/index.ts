import express from 'express';
import cors from 'cors';
import { JobController } from './module/controller';



const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.use('/api/v1', JobController);
  
const PORT =  3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});