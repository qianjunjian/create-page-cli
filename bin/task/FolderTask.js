const fs = require("fs-extra");
const path = require("path");
const BaseTask = require("./BaseTask");
module.exports = class FolderTask extends BaseTask {
  static type = "folder";
  constructor({ path, filename = "",name }) {
    super(FolderTask.type,name);
    this.path = path;
    this.filename = filename;
  }

  getFullPath() {
    return path.resolve(this.path, this.filename);
  }

  execute() {
    const path = this.getFullPath();
    if (fs.pathExistsSync(path)) {
      return {
        flag: "0",
        errMsg: "目录<" + path + ">已经存在！"
      }
    } else {
      fs.ensureDirSync(path);
      fs.ensureDirSync(path + "/img");
      return {
        flag: "1",
        data: path
      }
    }
  }
};
