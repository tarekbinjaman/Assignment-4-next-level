import express from 'express'
import userRoutes from './module/user/user.route'
import loginRoute from './module/auth/auth.route'
import tutorRoutes from "./module/tutorProfile/tutor.route"
import categoryRoutes from "./module/category/caategory.route";

const app = express();

app.use(express.json());

app.use("/api/user", userRoutes);
app.use("/api/auth", loginRoute);
app.use("/api/tutors", tutorRoutes);
app.use("/api/category", categoryRoutes);


app.get("/", (req, res) => {
    res.send("Hello, World")
})

export default app;