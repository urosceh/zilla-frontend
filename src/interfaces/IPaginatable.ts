export interface IPaginatable {
  limit?: number;
  offset?: number;
  orderCol?: string;
  orderDir?: "ASC" | "DESC";
}
