import { Router } from "express";
import authRouter from './auth/auth.router';
import userRouter from './user/user.router';
import categoriaRouter from './categoria/categoria.router';
import corsoRouter from './corso/corso.router';
import assegnazioneRouter from './assegnazione/assegnazione.router';
import statisticheRouter from './statistiche/statistiche.router';

const router = Router();

router.use('/users', userRouter);
router.use('/categorie', categoriaRouter);
router.use('/corsi', corsoRouter);
router.use('/assegnazioni', assegnazioneRouter);
router.use('/statistiche', statisticheRouter);
router.use(authRouter);

export default router;
