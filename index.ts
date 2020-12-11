import * as fs from "fs";

console.log("test");

let zipPath = "./test.zip";

fs.readFile(zipPath, (err, data) => {
  console.log(data);
});
