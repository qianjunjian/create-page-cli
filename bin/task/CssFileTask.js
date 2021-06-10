const fs = require("fs-extra");
const path = require("path");
const BaseTask = require("./BaseTask");

module.exports = class CssFileTask extends BaseTask {
  static type = "cssFile";
  constructor({ path, filename, content, name }) {
    super(CssFileTask.type, name);
    this.path = path;
    this.filename = filename;
    this.content = content;
  }

  getFullPath() {
    return path.resolve(this.path, this.filename);
  }

  execute() {
    fs.outputFileSync(this.getFullPath(), this.content);
    return {
      flag: "1",
      data: this.getFullPath()
    };
  }
};
