import express from "express";

const app = express();

app.get("/api/auth/callback/spotify", (req, res) => {
  console.log("🎯 HIT CALLBACK ROUTE");
  res.send("Callback route works!");
});

app.listen(3001, () => {
  console.log("Listening on 3001");
});
