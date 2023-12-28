import app from "./app";

const PORT: number = Number(process.env.PORT || 8000);

app.listen(PORT, () => {
  console.log(`Server started at: http://127.0.0.1:${PORT}`);
});
