export enum Endian {
  Little,
  Big,
}

//Local file header when the endianess is little.
const LITTLE_ENDIAN_BUFFER: Buffer = Buffer.from("504b0304", "hex");

export class Reader {
  buffer: Buffer;
  endian: Endian;
  offset: number;

  read2Bytes(buffer: Buffer): number {
    if (this.endian === Endian.Little) {
      let read = buffer.readUInt16LE(this.offset);
      this.offset += 2;
      return read;
    } else {
      let read = buffer.readUInt16BE(this.offset);
      this.offset += 2;
      return read;
    }
  }

  read4Bytes(buffer: Buffer): number {
    if (this.endian === Endian.Little) {
      let read = buffer.readUInt32LE(this.offset);
      this.offset += 4;
      return read;
    } else {
      let read = buffer.readUInt32BE(this.offset);
      this.offset += 4;
      return read;
    }
  }

  read8Bytes(buffer: Buffer): BigInt {
    if (this.endian === Endian.Little) {
      let read = buffer.readBigUInt64LE(this.offset);
      this.offset += 8;
      return read;
    } else {
      let read = buffer.readBigUInt64LE(this.offset);
      this.offset += 8;
      return read;
    }
  }

  sliceNBytes(buffer: Buffer, n: number) {
    if (this.endian === Endian.Little) {
      let read = buffer.slice(this.offset, this.offset + n);
      this.offset += n;
      return read;
    } else {
      let read = buffer.slice(this.offset, this.offset + n);
      this.offset += n;
      return read;
    }
  }

  constructor(zip: Buffer) {
    this.offset = 0;
    //Determine endianess on reader initialization.
    if (zip.readUInt32LE() === LITTLE_ENDIAN_BUFFER.readUInt32LE()) {
      this.endian = Endian.Little;
    } else {
      this.endian = Endian.Big;
    }
  }
}
