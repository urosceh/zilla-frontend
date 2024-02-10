export interface ISprintDto {
  sprintId: number;
  sprintName: string;
  projectKey: string;
  startOfSprint: string;
  endOfSprint: string;
}

export type CreateSprint = Omit<ISprintDto, "sprintId">;
