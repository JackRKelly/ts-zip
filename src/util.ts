export enum Compression {
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

export const compressionSwitch = (compressionBytes: number): Compression => {
  switch (compressionBytes) {
    case 0:
      return Compression.None;
    case 1:
      return Compression.Shrink;
    case 2:
      return Compression.Factor1;
    case 3:
      return Compression.Factor2;
    case 4:
      return Compression.Factor3;
    case 5:
      return Compression.Factor4;
    case 6:
      return Compression.Implode;
    case 8:
      return Compression.Deflate;
    case 9:
      return Compression.EnhancedDeflate;
    case 10:
      return Compression.PKWareDclImplode;
    case 12:
      return Compression.BZIP2;
    case 14:
      return Compression.LZMA;
    case 7:
    case 11:
    case 13:
    case 15:
    case 16:
    case 17:
      return Compression.Reserved;
    case 18:
      return Compression.IbmTerse;
    case 19:
      return Compression.IbmLZ77z;
    case 98:
      return Compression.PPMd;
  }
};

export const padNumber = (input: number, minLength: number): string => {
  let paddedNumber = input.toString();
  while (paddedNumber.length < minLength) {
    paddedNumber = "0" + paddedNumber;
  }
  return paddedNumber;
};

export const formatModDate = (dateBytes: number): string => {
  let dayBits = dateBytes & 0b0000000_0000_11111;
  let monthBits = (dateBytes >> 5) & 0b0000000_1111;
  let yearBits = dateBytes >> 9;

  return `${padNumber(monthBits, 2)}/${padNumber(dayBits, 2)}/${padNumber(
    yearBits + 1980,
    4
  )}`;
};

export const formatModTime = (timeBytes: number): string => {
  let secondBits = timeBytes & 0b00000_000000_11111;
  let minuteBits = (timeBytes >> 5) & 0b00000_111111;
  let hourBits = timeBytes >> 11;

  return `${padNumber(hourBits, 2)}:${padNumber(minuteBits, 2)}:${padNumber(
    secondBits * 2,
    2
  )}`;
};
