import express from 'express'

import { login, logout } from './auth.controller'
import { authenticateUser } from '../../middleware/authenticate';

const router = express.Router();

router.post("/login", login);
router.post("/logout", logout);


export default router;