/* eslint-disable no-console */
const chalk = require("chalk");
const fs = require("fs");

console.log("running post-install");

const moveDarwinConfig = async (folder, file) => {
  if (process.platform === "darwin") {
    try {
      // Because node-usb is not properly getting the config.h on MacOS to set
      // PLATFORM_POSIX & other constants for building the bindings_usb.node file
      // @TODO fix this on https://github.com/lightspeedretail/node-usb
      fs.readFile(`libusb/Xcode/config.h`, "utf8", (err, data) => {
        if (err) {
          return console.log("Error reading", err);
        }
        // Force HAVE_CLOCK_GETTIME to be undefined to support El Capitan
        const text = data.replace("#define HAVE_CLOCK_GETTIME 1", "");

        fs.writeFile(`libusb_config/config.h`, text, "utf8", (err) => {
          if (err) return console.log("Error writing", err);
        });
      });

      console.log(chalk.blue("file moved"));
    } catch (err) {
      console.log(err);
    }
  }
};

moveDarwinConfig();
