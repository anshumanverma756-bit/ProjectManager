<<<<<<< HEAD
import express from "express";
import cors from "cors";

const app =  express();

// basic configuration
app.use(express.json({ limit: "16kb"}));
app.use(express.urlencoded({ extended: true, limit: "16kb"}));
app.use(express.static("public"));

//cors configuration
app.use(
  cors({
  origin: process.env.CORS_ORIGIN?.split(",") || "http://localhost:5137",
  credentials :true,
  methods : ["GET","POST","PUT","PATCH","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"],
  }),
);

   import healthCheckRouter from "./routes/heathcheck.router.js";

app.use("/api/v1/healthcheck" , healthCheckRouter);

app.get("/", (req, res) => {
  res.send("Welcome here");
});
=======
import express from "express";
import cors from "cors";

const app =  express();

// basic configuration
app.use(express.json({ limit: "16kb"}));
app.use(express.urlencoded({ extended: true, limit: "16kb"}));
app.use(express.static("public"));

//cors configuration
app.use(
  cors({
  origin: process.env.CORS_ORIGIN?.split(",") || "http://localhost:5137",
  credentials :true,
  methods : ["GET","POST","PUT","PATCH","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"],
  }),
);

   import healthCheckRouter from "./routes/heathcheck.router.js";

app.use("/api/v1/healthcheck" , healthCheckRouter);

app.get("/", (req, res) => {
  res.send("Welcome here");
});
>>>>>>> origin/master
export default app;