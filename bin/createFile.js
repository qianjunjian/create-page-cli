const ejs = require("ejs");
const fs = require("fs-extra");

module.exports = function createFile(options) {
  const templateCode = fs.readFileSync(__dirname + "/template/index.ejs");
  const processedCode = ejs.render(templateCode.toString(), options);
  return new Promise((resolve, reject) => {
      resolve(processedCode)
  })
};
