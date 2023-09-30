export const toBinString = (bytes: Uint8Array) => {
  return bytes.reduce((str, byte) => {
    return str + byte.toString(2).padStart(4, "0");
  }, "");
};

export const uInt8ArrayToNumber = (bytes: Uint8Array | number) => {
  if (typeof bytes === "number") {
    return bytes;
  }

  return bytes[0] | (bytes[1] << 8)
}

export const uInt8ArrayToString = (bytes: Uint8Array, width: number = 8) => {
  let output = '';

  bytes.forEach((byte, idx) => {
    if (idx % width === 0) {
      output = output.trim() + '\n';
    }

    output += byte.toString(16).toUpperCase().padStart(2, '0') + ' ';
  });

  return output;
}

export const numberToHex = (number: number, width: number = 2) => {
  return number.toString(16).toUpperCase().padStart(width, '0');
}

export const convertTwosComplement = (value: number) => {
  // Check if the most significant bit (MSB) is set
  if (value & 0x80) {
    // If MSB is set, it's a negative value
    // Perform two's complement to convert to signed int
    return -((~value & 0xff) + 1)
  } else {
    // If MSB is not set, it's a positive value
    return value
  }
}
