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
