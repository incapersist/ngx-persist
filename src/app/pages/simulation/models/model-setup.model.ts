export interface ModelSetupMeta {
    id: number;
    parameter_set_id: number;
    hydrology_input_file_id: number;
    observed_input_file_id: number;
    effluent_input_file_id: number;
    abstraction_input_file_id: number;
    stream_network_id: number;
    reference: string;
    when_created: string;
    start_date: string;
    timesteps: number;
    is_default_for_new_user?: boolean;
}

export interface ResultSize {
    id: number;
    model_output_level: number;
    model_size_name: string;
    description: string;
}

export interface ModelVersion {
    id: number;
    version: string;
    logEntry: string;
    modelVersionCoreId: number;
    hasVariableStepSize: number;
}
