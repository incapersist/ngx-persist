export interface ReachRow {
    model_run_id: number;
    reach_id: number;
    timestep: number;
    input: number;
    flow: number;
    volume: number;
    residence_time: number;
}

export interface ResultsSetMeta {
    modelSetupId: number;
    reference: string;
    startDate: string;
    timesteps: number;
    levelId: number;
    levelName: string;
    levelDescription: string;
}

export interface ResultsItemMeta {
    resultItemId: number;
    resultItemName: string;
    resultTableId: number;
    modelVersionId: number;
    modelVersionCoreId: number;
}
