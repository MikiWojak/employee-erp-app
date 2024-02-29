type SingleApiErrorMessage = {
    param: string;
    message: string;
};

interface ValidationError {
    errors: SingleApiErrorMessage[];
}

interface IndexRequestParams {
    page?: number;
    search?: string;
}

export type { SingleApiErrorMessage, IndexRequestParams, ValidationError };
