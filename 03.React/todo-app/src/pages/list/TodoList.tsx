import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import * as _ from "lodash";

import BaseUrl from "@/apis/BaseUrl";
import TodoListItem from "./TodoListItem";
import SearchForm from "@/components/SearchForm";
import useDataFilter from "@/hooks/useDataFilter";

import { useTodoStore } from "@/store/todoStore";

import "./TodoList.css";

const TodoList: React.FC = () => {
  // const { _id } = useParams();
  const navigate = useNavigate();
  const todoStore = useTodoStore(); // 전역 raw todolist data

  const { filteredData, filterData } = useDataFilter(todoStore.todos);

  const [importantTodos, setImportantTodos] = useState<TodoList>([]);
  const [todos, setTodos] = useState<TodoList>([]);
  const [filterView, setFilterView] = useState({ value: "all", status: false });

  // 검색기능을 위한 상태들
  const [isSearch, setIsSearch] = useState(false);
  const [searchFilterdList, setSearchFilterdList] = useState<TodoList>([]);

  // get 요청
  const fetchData = useCallback(async () => {
    try {
      const response = await axios(`${BaseUrl}`);
      const todosResponse = response.data?.items || [];

      // 중요한 할 일과 일반 할 일을 분리
      const newImportantTodos: TodoItem[] = [];
      const newTodos: TodoItem[] = [];

      // 서버데이터받아와서 중요와 일반 나눠서 항목들 추가
      todosResponse.forEach((todo: TodoItem) => {
        todo.important ? newImportantTodos.push(todo) : newTodos.push(todo);
      });

      // 정제한 상태 그대로 전역 스토어 업데이트
      todoStore.setTodos(todosResponse);
      // 중요 리스트와 일반 리스트는 지역상태로 저장
      setImportantTodos(newImportantTodos);
      setTodos(newTodos);
    } catch (error) {
      console.error("데이터를 가져오는데 에러가 발생했습니다.", error);
    }
  }, []);

  /* active-container 필터링 함수 */
  const filterHandler = (
    value: string,
    setFilterView: React.Dispatch<
      React.SetStateAction<{ value: string; status: boolean }>
    >
  ) => {
    const mergeTodos = [...importantTodos, ...todos];
    filterData(mergeTodos, value, setFilterView);
  };

  /* todo-container 함수들 */
  // 전체 완료 함수
  const allDoneHandler = async () => {
    // 통신해서 서버에 저장하는 for문 돌리기 -> Promise.allSettled
    try {
      // important, todo 병합
      const mergeTodos = [...importantTodos, ...todos];

      const allCheckRequset = await Promise.allSettled(
        mergeTodos.map((item) =>
          axios.patch(`${BaseUrl}/${item._id}`, { done: true })
        )
      );

      const newImportantTodos: TodoItem[] = [];
      const newTodos: TodoItem[] = [];
      allCheckRequset.forEach((todo) => {
        if (todo.status === "fulfilled") {
          // 중요 항목 업데이트
          if (todo.value.data.item.important) {
            newImportantTodos.push(todo.value.data.item);
          }
          // 일반 항목 업데이트
          else {
            newTodos.push(todo.value.data.item);
          }
        } else if (todo.status === "rejected") {
          console.error("에러");
        }
      });

      // 화면 업데이트
      setImportantTodos([...newImportantTodos]);
      setTodos([...newTodos]);
    } catch (error) {
      console.error("항목을 모두 완료시키는데 요청 오류 발생", error);
    }
  };

  // 전체 삭제 함수
  const allDeleteHandler = async () => {
    try {
      const deleteConfirm = confirm("삭제하시겠습니까?");
      if (deleteConfirm) {
        // 서버에서 모든 항목 삭제시키기

        const mergeTodos = [...importantTodos, ...todos];

        // 필터 항목일 경우
        if (filterView.status) {
          await Promise.allSettled(
            filteredData.map((todo) => axios.delete(`${BaseUrl}/${todo._id}`))
          );

          const diffTodos = _.differenceBy(mergeTodos, filteredData, "_id");

          const newImportantTodos: TodoItem[] = [];
          const newTodos: TodoItem[] = [];
          diffTodos.forEach((todo) => {
            todo.important ? newImportantTodos.push(todo) : newTodos.push(todo);
          });
          filterData([], filterView.value, setFilterView);
          setImportantTodos([...newImportantTodos]);
          setTodos([...newTodos]);
        }
        // 전체 항목일 경우
        else {
          await Promise.allSettled(
            mergeTodos.map((todo) => axios.delete(`${BaseUrl}/${todo._id}`))
          );

          todoStore.setTodos([]);
          setImportantTodos([]);
          setTodos([]);
        }
      }
    } catch (error) {
      console.error("항목을 전체 삭제하는데 요청 오류 발생", error);
    }
  };

  /* Item에 적용된 함수 */
  // 완료, 미완료 체크박스 함수
  const isCompleteCheck = async (
    e: React.ChangeEvent<HTMLInputElement>,
    important: boolean,
    _id: number
  ) => {
    if (important) {
      const newImportantTodos = importantTodos.map((todo) => {
        return todo._id === _id ? { ...todo, done: e.target.checked } : todo;
      });
      setImportantTodos([...newImportantTodos]);
    } else {
      const newTodos = todos.map((todo) => {
        return todo._id === _id ? { ...todo, done: e.target.checked } : todo;
      });
      setTodos([...newTodos]);
    }

    try {
      await axios.patch(`${BaseUrl}/${_id}`, {
        done: e.target.checked,
      });
    } catch (error) {
      console.error(error);
    }
  };

  // 삭제
  const deleteItem = async (_id: number, important: boolean) => {
    const deleteResult = confirm("삭제하시겠습니까?");

    if (deleteResult) {
      if (important) {
        const filterImportantTodo = importantTodos.filter(
          (todo) => todo._id !== _id
        );
        setImportantTodos([...filterImportantTodo]);
      } else {
        const filterTodo = todos.filter((todo) => todo._id !== _id);
        setTodos([...filterTodo]);
      }

      await axios.delete(`${BaseUrl}/${_id}`);
    }
  };

  // 중요 체크
  const importantItem = async (
    btn: React.MouseEvent<HTMLButtonElement>,
    _id: number,
    important: boolean
  ) => {
    if (important) {
      btn.currentTarget.classList.remove("fill");
      // 중요 항목에서 뺀 것
      const filterImportantTodos = importantTodos.filter(
        (todo) => todo._id !== _id
      );

      // 뺀 항목을 중요하지 않는 항목에 추가
      const popImportantTodo = importantTodos.find((todo) => todo._id === _id);
      if (popImportantTodo) {
        const updateTodos = [
          ...todos,
          { ...popImportantTodo, important: false },
        ];
        setTodos([...updateTodos]);
        setImportantTodos([...filterImportantTodos]);
        await axios.patch(`${BaseUrl}/${_id}`, {
          important: false,
        });
      }
    } else {
      btn.currentTarget.classList.add("fill");
      // 중요하지 않은 항목에서 뺀 것
      const filterTodos = todos.filter((todo) => todo._id !== _id);

      // 뺀 항목을 중요 항목에 추가
      const popTodo = todos.find((todo) => todo._id === _id);
      if (popTodo) {
        const updateImportantTodos = [
          ...importantTodos,
          { ...popTodo, important: true },
        ];
        setImportantTodos([...updateImportantTodos]);
        setTodos([...filterTodos]);
        await axios.patch(`${BaseUrl}/${_id}`, {
          important: true,
        });
      }
    }
  };

  // 검색기능
  const searchHandler = (inputData: string) => {
    // 1. SearchForm으로부터 받은 인풋양식텍스트를 원본투두리스트에다 필터링해주는 작업 진행
    const searchFilteredArr = todoStore.todos.filter((todo) => {
      return todo.title.includes(inputData);
    });
    // 2. 검색리스트 배열에 업데이트
    setSearchFilterdList(searchFilteredArr);
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div id="page">
      <div className="active-container">
        <div className="filter-list">
          <button
            type="button"
            className="filter-list_item common-button"
            onClick={() => filterHandler("all", setFilterView)}
          >
            전체보기
          </button>
          <button
            type="button"
            className="filter-list_item common-button"
            onClick={() => filterHandler("!done", setFilterView)}
          >
            미완료
          </button>
          <button
            type="button"
            className="filter-list_item common-button"
            onClick={() => filterHandler("done", setFilterView)}
          >
            완료
          </button>
          <button
            type="button"
            className="filter-list_item common-button"
            onClick={() => filterHandler("important", setFilterView)}
          >
            중요
          </button>
        </div>
        <button
          type="button"
          className="registButton common-button"
          onClick={() => navigate("/regist")}
        >
          등록
        </button>
        <SearchForm
          placehordler="검색해 볼테야?"
          text="search"
          onSearch={searchHandler}
          setIsSearch={setIsSearch}
        />
      </div>
      <div id="contents" className="todo-container">
        <div className="todo-container__controller">
          <button
            className="completeAll"
            data-done="0"
            onClick={allDoneHandler}
          >
            ✅ 전체완료
          </button>
          <button
            className="deleteAll"
            name="deleteAll"
            onClick={allDeleteHandler}
          >
            ❌ 전체삭제
          </button>
        </div>
        <div className="todo-list-all">
          {/* 필터버튼 클릭후 해당 필터 데이터가 있다면 필터링 배열로 리턴 */}
          {filterView.status ? (
            filteredData?.map((todo) => (
              <TodoListItem
                key={todo._id!}
                isCompleteCheck={isCompleteCheck}
                deleteItem={deleteItem}
                importantItem={importantItem}
                todo={todo}
              />
            ))
          ) : isSearch ? (
            // 검색필터 적용된 리스트
            searchFilterdList?.map((todo) => (
              <TodoListItem
                key={todo._id}
                isCompleteCheck={isCompleteCheck}
                deleteItem={deleteItem}
                importantItem={importantItem}
                todo={todo}
              />
            ))
          ) : (
            <>
              {/* 중요 체크 todo */}
              <ul className="important-list">
                {importantTodos.map((todo) => (
                  <TodoListItem
                    key={todo._id!}
                    isCompleteCheck={isCompleteCheck}
                    deleteItem={deleteItem}
                    importantItem={importantItem}
                    todo={todo}
                  />
                ))}
              </ul>
              {/* 일반 todo */}
              <ul className="todolist">
                {todos?.map((todo) => {
                  return (
                    <TodoListItem
                      key={todo._id!}
                      isCompleteCheck={isCompleteCheck}
                      deleteItem={deleteItem}
                      importantItem={importantItem}
                      todo={todo}
                    />
                  );
                })}
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TodoList;
