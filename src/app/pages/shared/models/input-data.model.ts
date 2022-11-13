export interface InputDataColumn {
    name: string;
    data: number[];
}

export interface InputDataReach {
    reachId: string;
    columns: InputDataColumn[];
}

export interface InputData {
    reachCount: number;
    reachData: InputDataReach[];
}
/*
export interface InputDataFileMeta {
    id: number;
    name: string;
    original_filename: string;
    reaches: number;
    start_date: string;
    timesteps: number;
    reference: string;
}
*/
export interface InputDataFileMeta {
  id: number;
  filename: string;
  reference: string;
  startDate: string;
  uploadDate: string;
  tableName: string;
  modelRunColumnName: string;
  attribution?: string;
  isDownloadable?: boolean;
}
