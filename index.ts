import * as fs from "fs";

let zipPath = "./test.zip";

const bufferToString = (buffer: Buffer) => {
  return buffer.toString("hex").match(/../g).join(" ");
};

fs.readFile(zipPath, (err, data) => {
  if (err) console.error(err);
  console.log(data);
  console.log(data.length);
  console.log(data.toString("hex").match(/../g).join(" "));

  let signature = data.slice(0, 4);
  console.log(bufferToString(signature));
});
