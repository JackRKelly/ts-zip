enum Endian {
  Little,
  Big,
}

//Local file header when the endianess is little.
const LITTLE_ENDIAN_BUFFER: Buffer = Buffer.from("504b0304", "hex");

export class Reader {
  buffer: Buffer;
  endian: Endian;

  read2Bytes(buffer: Buffer): number {
    if (this.endian === Endian.Little) {
      return buffer.readUInt16LE();
    } else {
      return buffer.readUInt16BE();
    }
  }

  read4Bytes(buffer: Buffer): number {
    if (this.endian === Endian.Little) {
      return buffer.readUInt32LE();
    } else {
      return buffer.readUInt32BE();
    }
  }

  read8Bytes(buffer: Buffer): BigInt {
    if (this.endian === Endian.Little) {
      return buffer.readBigUInt64LE();
    } else {
      return buffer.readBigUInt64LE();
    }
  }

  constructor(signature: Buffer) {
    //Determine endianess on reader initialization.
    if (signature.readUInt32LE() === LITTLE_ENDIAN_BUFFER.readUInt32LE()) {
      console.log("Reading zip as little endian.");
      this.endian = Endian.Little;
    } else {
      console.log("Reading zip as big endian.");
      this.endian = Endian.Big;
    }
  }
}
