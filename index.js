const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const tradeRoutes = require("./routes/trade");
const adminRoutes = require("./routes/admin");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["https://prabhashgraphics.in", "https://prabhashgraphics.in/HappyBroker"], // Vite frontend
    methods: ["GET", "POST"],
  },
});

app.use(cors({
  origin: ["https://prabhashgraphics.in", "https://prabhashgraphics.in/HappyBroker"]
}));

app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

app.use("/api/auth", authRoutes);
app.use("/api/trades", tradeRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.send("Server running");
});

let stocks = [
  { symbol: "AAPL", price: 180 },
  { symbol: "GOOGL", price: 2700 },
  { symbol: "AMZN", price: 3300 },
  { symbol: "TSLA", price: 750 },
  { symbol: "MSFT", price: 310 },
  { symbol: "META", price: 325 },
  { symbol: "NFLX", price: 590 },
  { symbol: "NVDA", price: 480 },
  { symbol: "ORCL", price: 120 },
  { symbol: "IBM", price: 145 },
  { symbol: "INTC", price: 42 },
  { symbol: "AMD", price: 110 },
  { symbol: "BABA", price: 92 },
  { symbol: "ADBE", price: 520 },
  { symbol: "CRM", price: 210 },
  { symbol: "PYPL", price: 62 },
  { symbol: "UBER", price: 58 },
  { symbol: "LYFT", price: 15 },
  { symbol: "SHOP", price: 75 },
  { symbol: "SQ", price: 68 },
  { symbol: "SPOT", price: 195 },
  { symbol: "TWTR", price: 45 },
  { symbol: "ZOOM", price: 68 },
  { symbol: "SNAP", price: 12 },
  { symbol: "RBLX", price: 38 },
];

io.on("connection", socket => {
  console.log("Socket connected:", socket.id);

  socket.emit("stockUpdate", generatePrices());

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

function generatePrices() {
  return stocks.map(stock => {
    const change = (Math.random() - 0.5) * 5;
    stock.price = Math.max(1, stock.price + change);

    return {
      ...stock,
      change,
    };
  });
}

setInterval(() => {
  io.emit("stockUpdate", generatePrices());
}, 2000);

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
