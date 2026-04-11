import express from 'express'
import userRoutes from './module/user/user.route'

const app = express();

app.use(express.json());

app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
    res.send("Hello, World")
})

export default app;