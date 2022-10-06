import { Router, Request, Response } from 'express';

const router = Router();

router.get('/', (req:Request, res:Response) => {
  res.send('Welcome to Airtime to airtime app')
})

export default router;
