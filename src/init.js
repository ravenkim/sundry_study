import "dotenv/config";


import app from "./server";



const PORT = 7312;

const handleListening = () =>
  console.log(`✅ Server listenting on http://localhost:${PORT} 🚀`);

app.listen(PORT, handleListening);