export interface HasId {
  id: string;
}

export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

export interface Paginated<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
}

export type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};

export interface Repository<T extends HasId> {
  findAll(): Promise<Paginated<T>>;
  findById(id: string): Promise<T | undefined>;
  create(payload: Omit<T, 'id'>): Promise<T>;
  update(id: string, payload: Partial<Omit<T, 'id'>>): Promise<T>;
  delete(id: string): Promise<void>;
}