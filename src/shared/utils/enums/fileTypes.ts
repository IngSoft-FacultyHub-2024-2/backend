enum FileTypes {
    LECTURES = 'LECTURES',
  }

function getFileTypes() {
    return Object.values(FileTypes);
}

export { FileTypes, getFileTypes };
