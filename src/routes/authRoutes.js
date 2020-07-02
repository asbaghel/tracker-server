const express = require("express");
const mongoose = require("mongoose");
const User = mongoose.model("User");
const jwt = require("jsonwebtoken");
const router = express.Router();

router.post("/signup", async (req, res) => {
  const { phoneno, password } = req.body;

  try {
    console.log("/signup");
    const user = new User({ phoneno, password });

    await user.save();
    const token = jwt.sign({ userId: user._id }, "MY_SECERET");
    res.send({ token });
  } catch (err) {
    res.status(422).send(err.message);
  }
});

router.post("/signin", async (req, res) => {
  console.log("/signin");
  const { phoneno, password } = req.body;
  if (!phoneno || !password) {
    return res
      .status(422)
      .send({ error: "Must provide phone no and password" });
  }

  const user = await User.findOne({ phoneno });
  if (!user) {
    return res.status(422).send({ error: "Invalid Password or Phone No....." });
  }

  try {
    await user.comparePassword(password);

    const token = jwt.sign({ userId: user._id }, "MY_SECERET");

    res.send({ token });
  } catch (err) {
    return res.status(422).send({ error: "Invalid Password or Phone No. $ " });
  }
});
module.exports = router;
