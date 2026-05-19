export class FreelancerValidationException extends Error {
  constructor(freelancerId: string) {
    super(`Freelancer with ID ${freelancerId} is not valid or not authenticated`);
    this.name = 'FreelancerValidationException';
  }
}
