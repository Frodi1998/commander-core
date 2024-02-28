export async function loadFile(filePath: string) {
  let file;
  try {
    file = await import(`file:///${filePath}`);
  } catch (error) {
    file = await import(filePath);
  }

  return file.default ? file.default : file;
}
