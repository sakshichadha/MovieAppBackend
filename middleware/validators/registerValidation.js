const { check, validationResult } = require("express-validator");

exports.registerValidation = (req, res, next) => {
  [
    check("name", "Name is required").notEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
  ];
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.map((error) => error.msg)[0];
    return res.status(400).json({ error: firstError });
  }
  next();
};
