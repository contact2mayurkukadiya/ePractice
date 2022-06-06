export class ImageSnippet {
  status: string;
  pending: string;

  constructor(public src: string, public file: File) { }
}

export enum MessageType {
  error,
  success,
  warning,
  info,
}

export class ApplicationDataModel {
  constructor(
    public id: number,
    public categoryName,
    public categoryId: number,
    public status: boolean
  ) { }
}
export class DocTypeDataModel {
  constructor(
    public id: number,
    public folderName,
    public isStatus: boolean,
    public isAllowAllLocation: boolean,
    public locationName: string,
    public documentTypesLocation: boolean
  ) { }
}

export class ChartImageSnippet {
  status: string;
  pending: string;

  constructor(public src: string, public file: File) { }
}
