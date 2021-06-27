//A function that accepts a function, executes the function and captures any errors.
//To avoid replicating (try/catch)
module.exports = (func) => {
  return (req, res, next) => {
    func(req, res, next).catch(next);
  };
};
