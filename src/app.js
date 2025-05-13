const express = require("express");
const dotenv = require("dotenv");
const usersRouter = require("./routes/users");
const initSubscriber = require("./pubsub/subscriber");

dotenv.config();
const app = express();

app.use(express.json());
app.use("/users", usersRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await initSubscriber();
});
