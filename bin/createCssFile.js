const ejs = require("ejs");
const fs = require("fs-extra");

module.exports = function createCssFile(options) {
  const templateCode = fs.readFileSync(__dirname + "/template/css.ejs");
  const processedCode = ejs.render(templateCode.toString(), options);
  return new Promise((resolve, reject) => {
      resolve(processedCode)
  })
};
