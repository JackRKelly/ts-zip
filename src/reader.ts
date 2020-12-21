export enum Endian {
  Little,
  Big,
}

export enum LESignature {
  LocalFile = "504b0304",
  DataDescriptor = "504b0708",
  CentralDirectory = "504b0102",
  EndCentralDirectory = "504b0506",
}

//Local file header when the endianess is little.
const LE_LOCAL_FILE_HEADER: Buffer = Buffer.from(LESignature.LocalFile, "hex");

export class Reader {
  buffer: Buffer;
  endian: Endian;
  offset: number;

  read2Bytes(): number {
    let read: number;
    if (this.endian === Endian.Little) {
      read = this.buffer.readUInt16LE(this.offset);
    } else {
      read = this.buffer.readUInt16BE(this.offset);
    }
    this.offset += 2;
    return read;
  }

  read4Bytes(): number {
    let read: number;
    if (this.endian === Endian.Little) {
      read = this.buffer.readUInt32LE(this.offset);
    } else {
      read = this.buffer.readUInt32BE(this.offset);
    }
    this.offset += 4;
    return read;
  }

  read8Bytes(): BigInt {
    let read: BigInt;
    if (this.endian === Endian.Little) {
      read = this.buffer.readBigUInt64LE(this.offset);
    } else {
      read = this.buffer.readBigUInt64LE(this.offset);
    }
    this.offset += 8;
    return read;
  }

  sliceNBytes(n: number): Buffer {
    let read: Buffer;
    if (this.endian === Endian.Little) {
      read = this.buffer.slice(this.offset, this.offset + n);
    } else {
      read = this.buffer.slice(this.offset, this.offset + n);
    }
    this.offset += n;
    return read;
  }

  findHeader(header: string, byteOffset: number = 0): number {
    return this.buffer.indexOf(header, byteOffset, "hex");
  }

  setOffset(offset: number): void {
    this.offset = offset;
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
