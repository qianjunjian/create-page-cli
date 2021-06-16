
const readline = require('readline');
const path = require('path');
const fs = require('fs');
const os = require('os');
const BaseTask = require("./BaseTask");

module.exports = class ImportTask extends BaseTask {
  static type = "import";
  constructor({ name, path, containerName, pageName, className }) {
    super(ImportTask.type, name);
    this.path = path;
    this.containerName = containerName;
    this.pageName = pageName;
    this.className = className;
  }

  getInFile() {
    return path.resolve(this.path, this.containerName);
  }

  getOutFile() {
    return path.resolve(this.path, this.containerName + ".temp");
  }

  getRouter() {
    return this.pageName.replace(/([A-Z])/g, '-$1').toLowerCase();
  }

  execute() {
    return new Promise((resolve, reject) => {
      const inFile = this.getInFile();
      const outFile = this.getOutFile();
      const fRead = fs.createReadStream(inFile);
      const fWrite = fs.createWriteStream(outFile);
      const r1 = readline.createInterface({
          input: fRead
      });

      let findLazy = false;
      let importFlag = false;
      const ipmortText = `const ${this.className} = lazy(() => import("./${this.pageName}/${this.className}Container"));`

      let findRouteFlag = false;
      let importRouteFlag = false;
      const ipmortText2 = `                            <Route exact path="/${this.getRouter()}">`;
      const ipmortText3 = `                                <${this.className} />`;
      const ipmortText4 = '                            </Route>';

      r1.on('line', function(line) {
        if (!findLazy && line.indexOf("lazy") >= 0 && line.indexOf("=>") >= 0) {
            findLazy = true;
        }
        if (!findRouteFlag && line.indexOf("</Route>") >= 0) {
            findRouteFlag = true;
        }
        if (!importFlag && findLazy && line.indexOf("lazy") < 0 && line.indexOf("=>") < 0 ) {
            importFlag = true;
            fWrite.write(ipmortText + os.EOL);
            fWrite.write(line + os.EOL);
        } else if (!importRouteFlag && findRouteFlag && line.indexOf("<Redirect") >= 0 && line.indexOf("from") < 0) {
            importRouteFlag = true;
            fWrite.write(ipmortText2 + os.EOL);
            fWrite.write(ipmortText3 + os.EOL);
            fWrite.write(ipmortText4 + os.EOL);
            fWrite.write(line + os.EOL);
        } else if (!importRouteFlag && findRouteFlag && line.indexOf("</Switch>") >= 0) {
            importRouteFlag = true;
            fWrite.write(ipmortText2 + os.EOL);
            fWrite.write(ipmortText3 + os.EOL);
            fWrite.write(ipmortText4 + os.EOL);
            fWrite.write(line + os.EOL);
        } else {
            fWrite.write(line + os.EOL);
        }
      })

      r1.on('close', ()=>{
        fs.unlinkSync(inFile);
        fs.renameSync(outFile, inFile);
        resolve({
          flag: "1",
          data: this.getRouter()
        })
      });
    })
  }
};
