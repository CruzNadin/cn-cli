#!/usr/bin/env node

var cmd = require("node-cmd");
const ora = require("ora");
var fs = require("fs");
const fse = require("fs-extra");
var setTitle = require("console-title");
var pjson = require("./package.json");
const Table = require("cli-table");
var colors = require("colors");
setTitle("CruzNadin | React Native CLI");

const tulpar_base_url =
  "https://github.com/tulparyazilim/tulpar-base-reactnative.git";

function ModuleCreate(projectFolder, appname) {
  var path = __dirname + "/copy";
  var writepath = projectFolder + "/src";

  cmd.run(
    `cd ${path} && git clone ${tulpar_base_url}`,
    function (err, data, stderr) {
      try {
        if (!fs.existsSync(path)) {
          fs.mkdirSync(path, { overwrite: true });
        }
      } catch (error) {}

      try {
        fs.readFile(
          path + "/tulpar-base-reactnative/android/build.gradle",
          (error, data) => {
            var settingsdata = data;
            fs.writeFileSync(
              projectFolder + "/android/build.gradle",
              settingsdata
            );
          }
        );

        fs.readFile(
          path + "/tulpar-base-reactnative/android/settings.gradle",
          (error, data) => {
            var settingsdata = data.toString();
            var replacedata = settingsdata.replace(
              "tulparyazilim_base",
              appname
            );
            fs.writeFileSync(
              projectFolder + "/android/settings.gradle",
              replacedata
            );
          }
        );

        fs.readFile(
          path + "/tulpar-base-reactnative/android/app/build.gradle",
          (error, data) => {
            var buildata = data.toString();
            var replacebuild = buildata.replace("tulparyazilim_base", appname);
            fs.writeFileSync(
              projectFolder + "/android/app/build.gradle",
              replacebuild
            );
          }
        );
      } catch (error) {
        console.log(error);
      }

      try {
        path += "/tulpar-base-reactnative/";
        fs.readFile(path + "index.js", (error, data) => {
          fs.writeFile(projectFolder + "/index.js", data, (error) => {});
        });
      } catch (error) {
        console.log(error);
      }

      try {
        if (fs.existsSync(path + "/tulpar-base-reactnative")) {
          fs.rmdirSync(path + "/tulpar-base-reactnative", {
            force: true,
            recursive: true,
          });
        }
      } catch (error) {
        console.error(
          "There was an error while deleting base project folder. Error: " +
            error
        );
      }
      try {
        if (!fs.existsSync(writepath)) {
          fs.mkdirSync(writepath, { overwrite: true });
        }
      } catch (error) {}

      try {
        path += "/src";
        fse.copySync(path, writepath, { overwrite: true });
      } catch (error) {
        console.error(
          "There was an error while copying your files. Error: " + error
        );
      }
    }
  );
}

const oras = ora("Loading");

var consoleinput = process.argv[2];
if (consoleinput == "new") {
  var appname = process.argv[3];
  if (appname) {
    oras.start("Creating Project Please Wait.....");
    cmd.run(`npx react-native init ${appname}`, function (err, data, stderr) {
      oras.stop().succeed("Project Created");
      oras.start("Loading packages");
      cmd.run(
        `cd ${appname} && npm i @react-native-async-storage/async-storage @react-native-community/masked-view @react-native-community/netinfo @react-native-community/picker @react-navigation/bottom-tabs @react-navigation/drawer @react-navigation/native @react-navigation/stack @tele2/react-native-select-input html-entities moment react-native-cached-image react-native-crypto-js react-native-easy-grid react-native-elements react-native-gesture-handler react-native-htmlview react-native-image-picker react-native-image-viewing react-native-inappbrowser-reborn react-native-keyboard-aware-scrollview react-native-linear-gradient react-native-modalbox react-native-onesignal react-native-reanimated react-native-picker-select react-native-render-html react-native-safe-area-context react-native-safe-area-view react-native-screens react-native-svg react-native-toast-message react-native-vector-icons react-native-webview styled-components styled-system react-tracked --force`,
        function (err, data, stderr) {
          cmd.run(
            `cd ${appname} && npm i @svgr/cli react-native-splash-screen -D`,
            function (err, data, stderr) {
              ModuleCreate(process.cwd() + "/" + appname, appname);
              oras.stop().succeed("Packages Installed");
              if (process.platform == "darwin") {
                oras.start("Loading Pods.....");
                cmd.run(
                  `cd ${appname} && cd ios && cd pod install`,
                  function (err, data, stderr) {
                    oras.stop().succeed("Pods loaded");
                    console.log(colors.red.underline("cd " + appname));
                  }
                );
              } else {
                console.log(colors.red.underline("cd " + appname));
              }
            }
          );
        }
      );
    });
  } else {
    console.error(colors.red.underline("Project name cannot be blank"));
    console.info(colors.inverse("cn --help"));
  }
} else if (consoleinput == "run") {
  var runcode = process.argv[3];
  if (runcode == "ios") {
    oras.start("Building the app.....");
    cmd.run(`npm run ios`, function (err, data, stderr) {
      if (err) {
        oras.stop().fail("I can't find the package.json file");
        return false;
      }
      oras.stop().succeed("Created the application");
    });
  } else if (runcode == "clean:ios") {
    oras.start("Cleaning ios build file.....");
    cmd.run(
      `cd ios && xcodebuild clean && cd ..`,
      function (err, data, stderr) {
        if (err) {
          oras.stop().fail("I can't find the package.json file");
          return false;
        }
        oras.stop().succeed("IOS build file cleared");
      }
    );
  } else if (runcode == "ios-device") {
    var devicename = process.argv[4];
    oras.start(devicename + " Building the app.....");
    cmd.run(
      `npx react-native run-ios --device '${devicename}'`,
      function (err, data, stderr) {
        if (err) {
          oras.stop().fail("I can't find the package.json file");
          return false;
        }
        oras.stop().succeed(devicename + " Created the application");
      }
    );
  } else if (runcode == "ios-release") {
    oras.start("Ios release mode.....");
    cmd.run(
      `npx react-native run-ios --configuration Release`,
      function (err, data, stderr) {
        if (err) {
          oras.stop().fail("I can't find the package.json file");
          return false;
        }
        oras.stop().succeed("Switched to release mode");
      }
    );
  } else if (runcode == "android") {
    oras.start("Building the app.....");
    cmd.run(`npm run android`, function (err, data, stderr) {
      if (err) {
        oras.stop().fail("I can't find the package.json file");
        return false;
      }
      oras.stop().succeed("Created the application");
    });
  } else if (runcode == "clean:android") {
    oras.start("Cleaning android build file.....");
    cmd.run(
      `cd android && gradlew clean && cd ..`,
      function (err, data, stderr) {
        if (err) {
          oras.stop().fail("I can't find the package.json file");
          return false;
        }
        oras.stop().succeed("Android build file cleared");
      }
    );
  } else if (runcode == "android-release") {
    oras.start("Android release mode.....");
    cmd.run(
      `npx react-native run-android --variant=release`,
      function (err, data, stderr) {
        if (err) {
          oras.stop().fail("I can't find the package.json file");
          return false;
        }
        oras.stop().succeed("Switched to release mode");
      }
    );
  } else if (runcode == "icon") {
    oras.start("Creating icons.....");
    cmd.run(
      `npx react-native set-icon --path ./src/assets/icon_image.png`,
      function (err, data, stderr) {
        if (err) {
          oras.stop().fail("I can't find the package.json file");
          return false;
        }
        oras.stop().succeed("Icons created");
      }
    );
  } else if (runcode == "splash") {
    oras.start("Creating splash screen.....");
    cmd.run(
      `npx react-native set-splash --path ./src/assets/splash_image.png --resize center --background #FDC91B`,
      function (err, data, stderr) {
        if (err) {
          oras.stop().fail("I can't find the package.json file");
          return false;
        }
        oras.stop().succeed("Splash screen created");
      }
    );
  } else if (runcode == "pod") {
    if (process.platform == "darwin") {
      oras.start("Loading Pods.....");
      cmd.run(`cd ios && pod install && cd ..`, function (err, data, stderr) {
        if (err) {
          oras.stop().fail("I can't find the package.json file");
          return false;
        }
        oras.stop().succeed("Pods loaded.");
      });
    } else {
      console.error(
        colors.red.underline("pods are only available for ios users")
      );
    }
  } else {
    console.error(colors.red.underline("Please enter a valid command"));
    console.info(colors.inverse("cn --help"));
  }
} else if (
  consoleinput == "--help" ||
  consoleinput == "-help" ||
  consoleinput == "--h" ||
  consoleinput == "-h"
) {
  const table = new Table({
    head: ["#", "Command", "Description"],
    colors: false,
  });

  table.push(
    {
      1: ["cn new <app_name>", "To create a new project"],
    },
    {
      2: ["cn run android", "Utility to buy builds for android"],
    },
    {
      3: ["cn run clean:android", "Cleaning android build file"],
    },
    {
      4: ["cn run android-release", "Android release mode"],
    },
    {
      5: ["cn run ios", "Utility to buy builds for ios"],
    },
    {
      6: ["cn run clean:ios", "Cleaning ios build file"],
    },
    {
      7: ["cn run ios-device <DeviceName>", "Device building the app"],
    },
    {
      8: ["cn run ios-release", "Ios release mode"],
    },
    {
      9: [
        "cn run pod",
        "Installs the pods required for the project only for ios users",
      ],
    },
    {
      10: [
        "cn new-services <ServiceName>",
        "You can use this command to create service files.",
      ],
    },
    {
      11: ["cn run icon", "./src/assets/icon_image.png to creating icons"],
    },
    {
      12: [
        "cn run splash",
        "./src/assets/splash_image.png to splash screen only for ios users",
      ],
    }
  );

  console.log(colors.white(table.toString()));
} else if (
  consoleinput == "-v" ||
  consoleinput == "-version" ||
  consoleinput == "--v" ||
  consoleinput == "--version"
) {
  console.log("v" + pjson.version);
} else if (consoleinput == "new-services") {
  var servicesname = process.argv[3];
  if (servicesname) {
    function CreatedService(path, servicesname) {
      if (path && servicesname) {
        let filepath =
          path + "/src/app/services/" + servicesname + "Service" + ".ts";
        fs.readFile(filepath, (err) => {
          if (err) {
            fs.closeSync(fs.openSync(filepath, "w"));
            servicesdata = `import { BaseService } from "../../base/service/BaseService";
    
export default class ${servicesname}Service extends BaseService {
  constructor() {
    super("${servicesname}/");
  }
}`;
            fs.writeFileSync(filepath, servicesdata);
            console.log(colors.green(servicesname + " Created successfully"));
          } else {
            console.error(
              colors.red.underline("Such a service already exists.")
            );
          }
        });
      }
    }
    var projectFolder = process.cwd();
    if (fs.existsSync(projectFolder + "/src")) {
      if (fs.existsSync(projectFolder + "/src/app")) {
        if (fs.existsSync(projectFolder + "/src/app/services")) {
          CreatedService(projectFolder, servicesname);
        } else {
          fs.mkdir(
            projectFolder + "/src/app/services",
            { recursive: true },
            (err) => {
              if (!err) {
                CreatedService(projectFolder, servicesname);
              } else {
                console.error(
                  colors.red.underline(
                    "I can't find the app folder, please check the file directory."
                  )
                );
              }
            }
          );
        }
      } else {
        console.error(
          colors.red.underline(
            "I can't find the app folder, please check the file directory."
          )
        );
        console.info(colors.inverse("cn --help"));
      }
    } else {
      console.error(
        colors.red.underline(
          "I can't find the src folder, please check the file directory."
        )
      );
      console.info(colors.inverse("cn --help"));
    }
  } else {
    console.error(colors.red.underline("Services name cannot be blank"));
    console.info(colors.inverse("cn --help"));
  }
} else {
  console.error(colors.red.underline("There is no such command"));
  console.info(colors.inverse("cn --help"));
}
