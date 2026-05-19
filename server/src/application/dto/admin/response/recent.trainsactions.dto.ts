
export interface GetRecentTransactionsResponseDTO {
    transactions: {
        id?: string;
        entityName: string;
        type: string;
        amount: number;
        status: string;
        description: string;
        createdAt?: Date;
    }[];
    total: number;
    page: number;
    limit: number;
}