#!/usr/bin/env node

const getOptions = require("./options");
const TaskManager = require("./task/TaskManager");
const FolderTask = require("./task/FolderTask"); 
const FileTask = require("./task/FileTask");
const CssFileTask = require("./task/CssFileTask");
const path = require("path");
const createFile = require("./createFile");
const createCssFile = require("./createCssFile");

const containerDir = "./src/containers/";

(async () => {
    options = await getOptions();
    options.className = options.pageName.charAt(0).toUpperCase() + options.pageName.slice(1);
    const taskManager = new TaskManager();

    taskManager.add(createPackageTask());
    const code = await createFile(options);
    taskManager.add(createEntryPointFileTask(code));

    const code2 = await createCssFile(options);
    taskManager.add(createEntryPointCssFileTask(code2));

    await taskManager.execute();
})();

function getPath() {
    return path.resolve(process.cwd(), containerDir, options.pageName);
}

function createPackageTask() {
    return new FolderTask({
        name: "创建目录",
        path: getPath(),
    });
}

function createEntryPointFileTask(content) {
    return new FileTask({
      content,
      name: "创建js文件",
      filename: options.className + "Component.jsx",
      path: getPath(),
    });
}

function createEntryPointCssFileTask(content) {
    return new CssFileTask({
      content,
      name: "创建css文件",
      filename: options.pageName + "-container.less",
      path: getPath(),
    });
}