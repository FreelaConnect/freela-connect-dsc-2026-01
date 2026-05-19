export class ProjectNotFoundException extends Error {
  constructor(projectId: string) {
    super(`Project with ID ${projectId} not found`);
    this.name = 'ProjectNotFoundException';
  }
}
