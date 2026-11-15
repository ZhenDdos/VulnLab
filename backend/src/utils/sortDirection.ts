export function getSortDirection(value: unknown): "ASC" | "DESC" {
  return typeof value === "string" && value.toLowerCase() === "desc"
    ? "DESC"
    : "ASC";
}
