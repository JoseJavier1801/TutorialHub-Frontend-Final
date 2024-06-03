export interface homework {
    id: number;
    clientId: number;
    teacherId: number;
    archive: string;  // Assuming the archive will be a base64 string or similar
    datetime: Date;
    description: string;
}
