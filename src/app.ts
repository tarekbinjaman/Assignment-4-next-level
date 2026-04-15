import express from 'express'
import userRoutes from './module/user/user.route'
import { login } from './module/auth/auth.controller';

const app = express();

app.use(express.json());

app.use("/api/user", userRoutes);
app.use("/api/auth", login);

app.get("/", (req, res) => {
    res.send("Hello, World")
})

export default app;