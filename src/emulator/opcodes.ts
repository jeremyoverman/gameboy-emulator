import { readFile } from "fs";
export const opCodes = {} as const;

const readOpcodes = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rows: { [key: string]: any } = {};

  readFile("./docs/reference/opcodes.csv", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const lines = data.split("\n");
    lines.forEach((line, line_idx) => {
      const cols = line.split(";");
      if (line_idx === 0) return;

      let msb = "";
      cols.forEach((col, col_idx) => {
        if (col_idx === 0) {
          msb = (line_idx - 1).toString(16);
          rows[msb] = {};
          return;
        }

        const lsb = (col_idx - 1).toString(16);
        const [name, length, flags] = col.split("%");
        try {
          rows[msb][lsb] = {
            name,
            length: length.split("  ")[0],
            cycles: length.split("  ")[1],
            flags,
          };
        } catch (e) {
          rows[msb][lsb] = null;
        }
      });
    });

    console.log(rows["0"]);
  });
};

readOpcodes();
