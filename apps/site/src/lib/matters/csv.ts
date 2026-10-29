export const matterCsvHeaders = [
  "first_name",
  "last_name",
  "email",
  "petition_type",
  "sponsor_employer",
  "field_of_endeavor",
] as const;

export type CsvRecord = Record<(typeof matterCsvHeaders)[number], string>;

export function parseCsv(source: string): string[][] {
  const input = source.charCodeAt(0) === 0xfeff ? source.slice(1) : source;
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;

  for (let index = 0; index < input.length; index += 1) {
    const char = input[index];
    if (quoted) {
      if (char === '"' && input[index + 1] === '"') {
        field += '"';
        index += 1;
      } else if (char === '"') {
        quoted = false;
      } else {
        field += char;
      }
    } else if (char === '"' && field.length === 0) {
      quoted = true;
    } else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n" || char === "\r") {
      if (char === "\r" && input[index + 1] === "\n") index += 1;
      row.push(field);
      field = "";
      if (row.some((value) => value.trim() !== "")) rows.push(row);
      row = [];
    } else {
      field += char;
    }
  }

  if (quoted) throw new Error("CSV contains an unclosed quoted field.");
  row.push(field);
  if (row.some((value) => value.trim() !== "")) rows.push(row);
  return rows;
}

export function duplicateKey(
  record: Pick<CsvRecord, "email" | "petition_type" | "sponsor_employer">,
) {
  return [
    record.email.trim().toLowerCase(),
    record.petition_type.trim().toUpperCase(),
    record.sponsor_employer.trim().toLowerCase().replace(/\s+/g, " "),
  ].join("\u0000");
}
