export enum CompressionMethod {
  None = 0,
  Shrink = 1,
  Factor1 = 2,
  Factor2 = 3,
  Factor3 = 4,
  Factor4 = 5,
  Implode = 6,
  Reserved = 7,
  Deflate = 8,
  EnhancedDeflate = 9,
  PKWareDclImplode = 10,
  BZIP2 = 12,
  LZMA = 14,
  IbmTerse = 18,
  IbmLZ77z = 19,
  PPMd = 98,
}

export enum OS {
  MSDOS = 0,
  Amiga = 1,
  OpenVMS = 2,
  UNIX = 3,
  VMCMS = 4,
  AtariST = 5,
  OS2HPFS = 6,
  Macintosh = 7,
  ZSystem = 8,
  CPM = 9,
  WindowsNTFS = 10,
  MVS = 11,
  VSE = 12,
  AcornRisc = 13,
  VFAT = 14,
  AlternateMVS = 15,
  BeOS = 16,
  Tandem = 17,
  OS400 = 18,
  OSX = 19,
  Unused = 20,
}

export enum Endian {
  Little,
  Big,
}

export interface BitFlag {
  isEncrypted: boolean;
  hasDataDescriptor: boolean;
  enhancedDeflation: boolean;
  compressedPatchedData: boolean;
  strongEncryption: boolean;
  isUTF8: boolean;
  maskHeaderValues: boolean;
}

export interface LocalFileHeader {
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

export interface CentralDirectory {
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

export interface EndCentralDirectory {
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
