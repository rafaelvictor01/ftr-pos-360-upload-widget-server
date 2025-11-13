export enum R2_FOLDERS_ENUM {
  IMAGES,
  DOWNLOAD
}

export function getR2FolderNames(folder: R2_FOLDERS_ENUM) {
  switch (folder) {
    case R2_FOLDERS_ENUM.IMAGES:
      return 'images'
    case R2_FOLDERS_ENUM.DOWNLOAD:
      return'downloads'
    default:
      return 'unknown'
  }
}
