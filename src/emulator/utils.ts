export const toBinString = (bytes: Uint8Array) => {
  return bytes.reduce((str, byte) => {
    return str + byte.toString(2).padStart(4, "0");
  }, "");
};
