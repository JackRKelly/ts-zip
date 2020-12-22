import {
  compressionMethod,
  formatModTime,
  formatModDate,
  CompressionMethod,
  versionMade,
  OS,
  Endian,
  LESignature,
} from "./util";
import * as zlib from "zlib";

interface BitFlag {
  isEncrypted: boolean;
  hasDataDescriptor: boolean;
  enhancedDeflation: boolean;
  compressedPatchedData: boolean;
  strongEncryption: boolean;
  isUTF8: boolean;
  maskHeaderValues: boolean;
}

interface LocalFileHeader {
  signature: number;
  extractVersion: OS;
  bitFlag: BitFlag;
  compression: CompressionMethod;
  modTime: string;
  modDate: string;
  crc32: number;
  compressedSize: number;
  uncompressedSize: number;
  fileNameLength: number;
  extraFieldLength: number;
  fileName: string;
  extraField: Buffer;
  fileData: Buffer;
}

interface CentralDirectory {
  signature: number;
  version: OS;
  extractVersion: number;
  bitFlag: BitFlag;
  compression: CompressionMethod;
  modTime: string;
  modDate: string;
  crc32: number;
  compressedSize: number;
  uncompressedSize: number;
  fileNameLength: number;
  extraFieldLength: number;
  fileCommentLength: number;
  diskStart: number;
  internalAttributes: number;
  externalAttributes: number;
  localHeaderOffset: number;
  fileName: string;
  extraField: Buffer;
  fileComment: string;
}

interface EndCentralDirectory {
  signature: number;
  diskNumber: number;
  diskCentralStart: number;
  numberOfDirectoryRecords: number;
  totalNumberOfRecords: number;
  sizeOfCentralDirectory: number;
  offsetOfCentralDirectory: number;
  commentLength: number;
  comment: string;
}
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

  hasSignature(signature: LESignature): boolean {
    let cursor = this.offset;
    while (this.buffer.readUInt32LE(cursor) !== signature) {
      cursor += 1;
      if (cursor + 4 > this.buffer.length) {
        return false;
      }
    }
    return true;
  }

  findSignature(signature: LESignature): number {
    let cursor = this.offset;
    while (this.buffer.readUInt32LE(cursor) !== signature) {
      cursor += 1;
      if (cursor + 4 > this.buffer.length) {
        cursor = -1;
        break;
      }
    }
    return cursor;
  }

  setOffset(offset: number): void {
    this.offset = offset;
  }

  uncompressFileData(data: Buffer, compression: CompressionMethod): Buffer {
    switch (compression) {
      case CompressionMethod.None:
        return data;
      case CompressionMethod.Deflate:
        return zlib.inflateRawSync(data);
    }
  }

  readBitFlag(bitFlag: number): BitFlag {
    // Bit 00: encrypted file
    // Bit 01: compression option
    // Bit 02: compression option
    // Bit 03: data descriptor
    // Bit 04: enhanced deflation
    // Bit 05: compressed patched data
    // Bit 06: strong encryption
    // Bit 07-10: unused
    // Bit 11: language encoding
    // Bit 12: reserved
    // Bit 13: mask header values
    // Bit 14-15: reserved

    let isEncrypted = Boolean(bitFlag & 0b1);
    let hasDataDescriptor = Boolean(bitFlag & 0b1000);
    let enhancedDeflation = Boolean(bitFlag & 0b1_0000);
    let compressedPatchedData = Boolean(bitFlag & 0b10_0000);
    let strongEncryption = Boolean(bitFlag & 0b100_0000);
    let isUTF8 = Boolean(bitFlag & 0b100_0000_0000);
    let maskHeaderValues = Boolean(bitFlag & 0b1000_0000_0000);

    return {
      isEncrypted,
      hasDataDescriptor,
      enhancedDeflation,
      compressedPatchedData,
      strongEncryption,
      isUTF8,
      maskHeaderValues,
    };
  }

  readLocalFileHeaders(): LocalFileHeader[] {
    // 0    | 4 : Local file header signature = 0x04034b50 (read as a little-endian number)
    // 4    | 2 : Version needed to extract (minimum)
    // 6    | 2 : General purpose bit flag
    // 8    | 2 : Compression method
    // 10   | 2 : File last modification time
    // 12   | 2 : File last modification date
    // 14   | 4 : CRC-32 of uncompressed data
    // 18   | 4 : Compressed size
    // 22   | 4 : Uncompressed size
    // 26   | 2 : File name length (n)
    // 28   | 2 : Extra field length (m)
    // 30   | n : File name
    // 30+n | m : Extra field

    let localFileHeaders: LocalFileHeader[] = [];

    while (this.hasSignature(LESignature.LocalFile)) {
      this.setOffset(this.findSignature(LESignature.LocalFile));
      let signature = this.read4Bytes();
      let extractVersion = versionMade(this.read2Bytes());
      let bitFlag = this.readBitFlag(this.read2Bytes());
      let compression = compressionMethod(this.read2Bytes());
      let modTime = formatModTime(this.read2Bytes());
      let modDate = formatModDate(this.read2Bytes());
      let crc32 = this.read4Bytes();
      let compressedSize = this.read4Bytes();
      let uncompressedSize = this.read4Bytes();
      let fileNameLength = this.read2Bytes();
      let extraFieldLength = this.read2Bytes();
      let fileName = this.sliceNBytes(fileNameLength).toString();
      let extraField = this.sliceNBytes(extraFieldLength);
      let fileData = this.uncompressFileData(
        this.sliceNBytes(uncompressedSize),
        compression
      );

      if (bitFlag.hasDataDescriptor) {
        // 0    | 0/4 : Optional data descriptor signature = 0x08074b50
        // 0/4  | 4   : CRC-32 of uncompressed data
        // 4/8  | 4   : Compressed size
        // 8/12 | 4   : Uncompressed size

        this.setOffset(this.findSignature(LESignature.DataDescriptor));
        let signature = this.read4Bytes();

        crc32 = this.read4Bytes();
        compressedSize = this.read4Bytes();
        uncompressedSize = this.read4Bytes();
      }

      localFileHeaders.push({
        signature,
        extractVersion,
        bitFlag,
        compression,
        modTime,
        modDate,
        crc32,
        compressedSize,
        uncompressedSize,
        fileNameLength,
        extraFieldLength,
        fileName,
        extraField,
        fileData,
      });
    }

    return localFileHeaders;
  }

  readCentralDirectories(): CentralDirectory[] {
    // 0      | 4	: Central directory file header signature = 0x02014b50
    // 4      | 2	: Version made by
    // 6      | 2	: Version needed to extract (minimum)
    // 8      | 2	: General purpose bit flag
    // 10     | 2	: Compression method
    // 12     | 2	: File last modification time
    // 14     | 2	: File last modification date
    // 16     | 4	: CRC-32 of uncompressed data
    // 20     | 4	: Compressed size
    // 24     | 4	: Uncompressed size
    // 28     | 2	: File name length (n)
    // 30     | 2	: Extra field length (m)
    // 32     | 2	: File comment length (k)
    // 34     | 2	: Disk number where file starts
    // 36     | 2	: Internal file attributes
    // 38     | 4	: External file attributes
    // 42     | 4	: Relative offset of local file header. This is the number of bytes between the start of the first disk on which the file occurs, and the start of the local file header. This allows software reading the central directory to locate the position of the file inside the ZIP file.
    // 46     | n	: File name
    // 46+n   | m	: Extra field
    // 46+n+m | k	: File comment

    let centralDirectories: CentralDirectory[] = [];

    while (this.hasSignature(LESignature.CentralDirectory)) {
      this.setOffset(this.findSignature(LESignature.CentralDirectory));
      let signature = this.read4Bytes();
      let version = versionMade(this.read2Bytes());
      let extractVersion = this.read2Bytes();
      let bitFlag = this.readBitFlag(this.read2Bytes());
      let compression = compressionMethod(this.read2Bytes());
      let modTime = formatModTime(this.read2Bytes());
      let modDate = formatModDate(this.read2Bytes());
      let crc32 = this.read4Bytes();
      let compressedSize = this.read4Bytes();
      let uncompressedSize = this.read4Bytes();
      let fileNameLength = this.read2Bytes();
      let extraFieldLength = this.read2Bytes();
      let fileCommentLength = this.read2Bytes();
      let diskStart = this.read2Bytes();
      let internalAttributes = this.read2Bytes();
      let externalAttributes = this.read4Bytes();
      let localHeaderOffset = this.read4Bytes();
      let fileName = this.sliceNBytes(fileNameLength).toString();
      let extraField = this.sliceNBytes(extraFieldLength);
      let fileComment = this.sliceNBytes(fileCommentLength).toString();

      centralDirectories.push({
        signature,
        version,
        extractVersion,
        bitFlag,
        compression,
        modTime,
        modDate,
        crc32,
        compressedSize,
        uncompressedSize,
        fileNameLength,
        extraFieldLength,
        fileCommentLength,
        diskStart,
        internalAttributes,
        externalAttributes,
        localHeaderOffset,
        fileName,
        extraField,
        fileComment,
      });
    }

    return centralDirectories;
  }

  readEndCentralDirectory(): EndCentralDirectory {
    // 0  | 4 : End of central directory signature = 0x06054b50
    // 4  | 2 : Number of this disk
    // 6  | 2 : Disk where central directory starts
    // 8  | 2 : Number of central directory records on this disk
    // 10 | 2 : Total number of central directory records
    // 12 | 4 : Size of central directory (bytes)
    // 16 | 4 : Offset of start of central directory, relative to start of archive
    // 20 | 2 : Comment length (n)
    // 22 | n : Comment

    this.setOffset(this.findSignature(LESignature.EndCentralDirectory));
    let signature = this.read4Bytes();
    let diskNumber = this.read2Bytes();
    let diskCentralStart = this.read2Bytes();
    let numberOfDirectoryRecords = this.read2Bytes();
    let totalNumberOfRecords = this.read2Bytes();
    let sizeOfCentralDirectory = this.read4Bytes();
    let offsetOfCentralDirectory = this.read4Bytes();
    let commentLength = this.read2Bytes();
    let comment = this.sliceNBytes(commentLength).toString();

    return {
      signature,
      diskNumber,
      diskCentralStart,
      numberOfDirectoryRecords,
      totalNumberOfRecords,
      sizeOfCentralDirectory,
      offsetOfCentralDirectory,
      commentLength,
      comment,
    };
  }

  constructor(zip: Buffer) {
    this.offset = 0;
    this.buffer = zip;
    //Determine endianess on reader initialization.

    if (zip.readUInt32LE() === LESignature.LocalFile) {
      this.endian = Endian.Little;
    } else {
      this.endian = Endian.Big;
    }
  }
}
