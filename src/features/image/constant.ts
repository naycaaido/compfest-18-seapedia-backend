export class File {
  fieldName:string
  fileName:string
  mimeType:string
  buffer: Buffer

  constructor(fieldName:string,fileName:string,mimeType:string,buffer: Buffer) {
    this.fieldName = fieldName
    this.fileName = fileName
    this.mimeType = mimeType
    this.buffer = buffer
  }
}

