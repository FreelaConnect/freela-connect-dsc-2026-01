export class Project {
    id: string;
    title: string
    description: string;
    contractId: string;
    budget: number;
    createdAt: Date;
    updatedAt: Date;
    constructor(
        id: string,
        title: string,
        description: string,
        contractorId: string,
        budget: number,
        createdAt: Date,
        updatedAt: Date
    ) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.contractId = contractorId;
        this.budget = budget;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}

        