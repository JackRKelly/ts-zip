enum Endian {
  Little,
  Big,
}

const LITTLE_ENDIAN_BUFFER: Buffer = Buffer.from("504b0304", "hex");

export class Reader {
  buffer: Buffer;
  endian: Endian;

  read4Bytes(buffer: Buffer) {
    if (this.endian === Endian.Little) {
      return buffer.readUInt32LE();
    } else {
      return buffer.readUInt32BE();
    }
  }

  constructor(signature: Buffer) {
    if (signature.readUInt32LE() === LITTLE_ENDIAN_BUFFER.readUInt32LE()) {
      console.log("Reading zip as little endian.");
      this.endian = Endian.Little;
    } else {
      console.log("Reading zip as big endian.");
      this.endian = Endian.Big;
    }
  }
}
