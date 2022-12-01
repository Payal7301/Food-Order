require('dotenv').config()

const app = require("express")();
const path = require("path");
var bodyParser = require('body-parser')
const cors = require("cors");

const shortid = require("shortid");
const Razorpay = require("razorpay");
// create application/json parser
var jsonParser = bodyParser.json()
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

app.use(cors());


app.get("/logo.png", (req, res) => {
  res.sendFile(path.join(__dirname, "logo.png"));
});

app.post("/razorpay",jsonParser, async (req, res) => {
  const payment_capture = 1;
  const {value}=req.body;
  const amount = 100;
  const currency = "INR";

  const options = {
    amount: amount * 100,
    currency,
    receipt: shortid.generate(),
    payment_capture,
  };

  try {
    const response = await razorpay.orders.create(options);
    console.log(response);
    res.json({
      id: response.id,
      currency: response.currency,
      amount: response.amount,
    });
  } catch (error) {
    console.log(error);
  }
});

app.listen(1337, () => {
  console.log("Backend running at localhost:1337");
});