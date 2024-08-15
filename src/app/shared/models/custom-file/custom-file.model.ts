export interface SampleFile {
    originalfilename: string;
    filename: string;
    dirpath: string;
    size: string;
    mimetype: string;
    updatedAt?: Date;
}

export interface CustomFileModel {
    _id: string;
    originalfilename: string;
    filename: string;
    dirpath: string;
    size: string;
    mimetype: string;
    price: number;
    isDeleted: boolean;
    // sampleFiles: SampleFile[];
    sampleFiles: String[];
    updatedAt?: Date;
    previewUrl:string;
}