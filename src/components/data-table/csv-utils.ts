export const escapeCSV = (value: string) => {
  const stringValue = String(value);
  // Escape quotes and handle values containing commas or newlines
  if (stringValue.includes(",") || stringValue.includes("\"") || stringValue.includes("\n")) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
};

export const downloadCSV = (headers: string[], rows: string[][], filename: string = "export.csv") => {
  // Create CSV content with proper escaping
  const csvContent = [
    headers.map(escapeCSV),
    ...rows.map(row => row.map(escapeCSV))
  ].map(row => row.join(",")).join("\n");

  // Add BOM for proper Excel encoding
  const BOM = "\uFEFF";
  const blob = new Blob([BOM + csvContent], { type: "text/csv;charset=utf-8;" });
  
  // Create download link
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};