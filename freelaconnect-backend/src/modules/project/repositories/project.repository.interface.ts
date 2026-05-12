import { Project } from '../entities/project.entities';

export const PROJECT_REPOSITORY = 'PROJECT_REPOSITORY';

export interface ProjectRepository {
    findById(id: string): Promise<Project | null>;
    updateStatus(id: string, status: string): Promise<Project>;
}
