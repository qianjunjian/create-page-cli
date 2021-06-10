module.exports = () => {
    return {
        type: "input",
        name: "pageName",
        message: "请输入页面名称name。例如:<[name]-Container>:",
        validate(value) {
            if (value) {
              return true;
            }
            return "Please enter page name";
        },
    };
};