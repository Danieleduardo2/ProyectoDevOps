import { http } from "./http";

export type UserAction = {
  usuario: string;
  accion: string;
  fecha: string; // viene como ISO string
};

export type PageResponse<T> = {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
};

export async function getUserActions(params: {
  page: number;
  size: number;
}): Promise<PageResponse<UserAction>> {
  const { data } = await http.get<PageResponse<UserAction>>(
    "/api/users/actions",
    { params }
  );
  return data;
}