// todolist CRUD requset/response 코드-> 서버 상태

import BaseUrl from "../BaseUrl";
import { defaultInstance } from "../utils";

// 전체 조회 axios
export const getTodos = async () => {
  try {
    const response = await defaultInstance.get(BaseUrl);
    return response.data?.items || [];
  } catch (error) {
    console.error("할일 목록을 조회중 네트워크에러 발생.", error);
  }
};

// 상세 조회 axios
export const getTodo = async (_id: number) => {
  try {
    const response = await defaultInstance.get<TodoItem>(`${BaseUrl}/${_id}`);

    return response.data;
  } catch (error) {
    console.error("특정 항목을 불러오는 중 네트워크 에러 발생.", error);
  }
};

// 할일 추가 axios
export const postTodos = async (newTodo: TodoItem) => {
  try {
    await defaultInstance.post<TodoResponse | TodoErrorResponse>(
      BaseUrl,
      newTodo
    );
  } catch (error) {
    console.error("할일 추가중 네트워크에러 발생.", error);
  }
};

// 수정 axios
export const editTodos = async (_id: number, updateTodo: TodoItem) => {
  try {
    await defaultInstance.patch<TodoResponse | TodoErrorResponse>(
      `${BaseUrl}/${_id}`,
      updateTodo
    );
  } catch (error) {
    console.error("특정 항목을 수정중 네트워크 에러 발생.", error);
  }
};

// 삭제  axios
export const removeTodos = async (_id: number) => {
  try {
    await defaultInstance.delete(`${BaseUrl}/${_id}`);
  } catch (error) {
    console.error("특정 항목을 삭제 중 네트워크 에러 발생.", error);
  }
};
