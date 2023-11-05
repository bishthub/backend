// middleware/validate.js
const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error } = schema.validate(req[property]);
    if (error) {
      res.status(400).send(error.details[0].message);
    } else {
      next();
    }
  };
};

module.exports = validate;
