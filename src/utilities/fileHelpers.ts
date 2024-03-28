export function downloadFile(fileContent: any, fileName: string) {
  const url = window.URL.createObjectURL(fileContent);

  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

export function openFile(fileContent: any) {
  const url = window.URL.createObjectURL(fileContent);

  const a = document.createElement("a");
  a.href = url;
  a.target = "_blank";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
