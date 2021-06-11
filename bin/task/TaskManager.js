const FileTask = require("./FileTask");
const FolderTask = require("./FolderTask");
const CommandTask = require("./CommandTask");
const CssFileTask = require("./CssFileTask");
const ImportTask = require("./ImportTask");
const chalk = require("chalk");
const log = console.log;

module.exports = class TaskManager {
  constructor() {
    this.taskList = [];
  }

  add(task) {
    if (Array.isArray(task)) {
      this.taskList.push(...task);
    } else {
      this.taskList.push(task);
    }
  }

  size() {
    return this.taskList.length;
  }

  getTasksByType(type) {
    return this.taskList.filter((task) => {
      return task.getType() === type;
    });
  }

  async execute() {
    // 执行命令需要有前后顺序
    // 先执行所有创建文件夹的task
    await this.executeTaskByType(FolderTask.type);

    // 在执行所有文件的task
    await this.executeTaskByType(FileTask.type);

    // 在执行所有文件的task
    await this.executeTaskByType(CssFileTask.type);

    await this.executeTaskByType(ImportTask.type);

    //执行所有的 command task
    await this.executeTaskByType(CommandTask.type);
  }

  async executeTaskByType(commandType) {
    const commandTasks = this.getTasksByType(commandType);
    for (const task of commandTasks) {
      const res = await task.execute();
      if (res.flag === "1") {
        log(chalk.green(task.getName() + "成功") + ": " + chalk.blue(res.data));
      } else {
        log(chalk.red(task.getName() + "失败," + res.errMsg));
      }
    }
  }
};
