import express from "express";
import { client } from "@vigilio/express-core/client";
import nunjucks from "nunjucks";
import path from "node:path";
import dotenv from "dotenv";
dotenv.config({ path: ".env" });

const app = express();

app.use(express.static(path.resolve(__dirname, "public")));

// vite
app.use(client({ file: "js/app.js" })); //ts/app.js

// njk
nunjucks.configure(path.resolve(__dirname, "resources", "views"), {
    autoescape: true,
    express: app,
    noCache: true,
});

app.set("view engine", "njk"); //! if you change to html . error

app.get("/", (_req, res) => {
    return res.render("index");
});

app.listen(process.env.PORT, () => {
    console.log(`running ${process.env.PORT} server`);
});
