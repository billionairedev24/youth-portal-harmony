export const escapeCSV = (value: string) => {
  const stringValue = String(value);
  if (stringValue.includes(",") || stringValue.includes("\"") || stringValue.includes("\n")) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
};

export const downloadCSV = (headers: string[], rows: string[][], filename: string = "export.csv") => {
  const csvContent = [
    headers.map(escapeCSV),
    ...rows.map(row => row.map(escapeCSV))
  ].map(row => row.join(",")).join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};