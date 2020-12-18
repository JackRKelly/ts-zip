export enum Endian {
  Little,
  Big,
}

//Local file header when the endianess is little.
const LE_LOCAL_FILE_HEADER: Buffer = Buffer.from("504b0304", "hex");
const LE_CENTRAL_DIRECTORY_HEADER: Buffer = Buffer.from("504b0102", "hex");
export class Reader {
  buffer: Buffer;
  endian: Endian;
  offset: number;

  read2Bytes(): number {
    if (this.endian === Endian.Little) {
      let read = this.buffer.readUInt16LE(this.offset);
      this.offset += 2;
      return read;
    } else {
      let read = this.buffer.readUInt16BE(this.offset);
      this.offset += 2;
      return read;
    }
  }

  read4Bytes(): number {
    if (this.endian === Endian.Little) {
      let read = this.buffer.readUInt32LE(this.offset);
      this.offset += 4;
      return read;
    } else {
      let read = this.buffer.readUInt32BE(this.offset);
      this.offset += 4;
      return read;
    }
  }

  read8Bytes(): BigInt {
    if (this.endian === Endian.Little) {
      let read = this.buffer.readBigUInt64LE(this.offset);
      this.offset += 8;
      return read;
    } else {
      let read = this.buffer.readBigUInt64LE(this.offset);
      this.offset += 8;
      return read;
    }
  }

  sliceNBytes(n: number) {
    if (this.endian === Endian.Little) {
      let read = this.buffer.slice(this.offset, this.offset + n);
      this.offset += n;
      return read;
    } else {
      let read = this.buffer.slice(this.offset, this.offset + n);
      this.offset += n;
      return read;
    }
  }

  findHeader(header: string): number {
    return this.buffer.indexOf(header, 0, "hex");
  }

  constructor(zip: Buffer) {
    this.offset = 0;
    this.buffer = zip;
    //Determine endianess on reader initialization.
    if (zip.readUInt32LE() === LE_LOCAL_FILE_HEADER.readUInt32LE()) {
      this.endian = Endian.Little;
    } else {
      this.endian = Endian.Big;
    }
  }
}
