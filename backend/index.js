const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const http = require("http");

const routes = {
  mt: require("./routes/MTRoutes"),
  ps: require("./routes/PSRoutes"),
  bw: require("./routes/BWRoutes"),
  mb: require("./routes/MBRoutes"),
  rp: require("./routes/RPRoutes"),
  tv: require("./routes/TV5Routes"),
  abs: require("./routes/ABSCBNRoutes"),
  gma: require("./routes/GMARoutes"),
  inq: require("./routes/InqRoutes"),
  translate: require("./routes/TranslationRoutes"),
  paraphrase: require("./routes/ParaphraseRoutes"),
  gemini: require("./routes/GeminiRoutes"),
};

const app = express();
dotenv.config();

const server = http.createServer(app);

app.use(express.json());
app.use(cors({
  origin: "*",
  credentials: true,
  optionsSuccessStatus: 200,
}));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,PATCH");
  res.header("Access-Control-Allow-Headers", 
    "Origin, X-Requested-With, Content-Type, Accept, " +
    "x-client-key, x-client-token, x-client-secret, Authorization"
  );
  console.log(`${req.method} ${req.path}`);
  next();
});

app.use("/api/mt", routes.mt);
app.use("/api/ps", routes.ps);
app.use("/api/bw", routes.bw);
app.use("/api/mb", routes.mb);
app.use("/api/rp", routes.rp);
app.use("/api/tv", routes.tv);
app.use("/api/abs", routes.abs);
app.use("/api/gma", routes.gma);
app.use("/api/inq", routes.inq);
app.use("/api/translate", routes.translate);
app.use("/api/paraphrase", routes.paraphrase);
app.use("/api/gemini", routes.gemini);

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
