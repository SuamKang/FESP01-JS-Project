// 상태관리 라이브러리 -> zustand 사용 - Flux패턴
// 주스탄은 provider를 만들어서 감싸줄 필요가 없다.
import { create } from "zustand";

interface TodoListState {
  todos: TodoList;
  setTodos: (todos: TodoList) => void;
  addTodo: (newTodo: TodoItem) => void;
  removeTodo: (id: number) => void;
  editTodo: (updateTodo: TodoItem) => void;
}

export const useTodoStore = create<TodoListState>((set) => ({
  todos: [],
  setTodos: (todos) => {
    set(() => ({
      todos: todos,
    }));
  },
  addTodo: (newTodo) => {
    console.log("addTodo 실행");
    console.log("newTodo:", newTodo);
    set((state) => ({
      todos: [...state.todos, newTodo],
    }));
  },
  removeTodo: (id: number) => {
    set((state) => ({
      todos: state.todos.filter((todo) => todo._id !== id),
    }));
  },
  editTodo: (updateTodo: TodoItem) => {
    set((state) => ({
      todos: state.todos.map((todo) =>
        todo._id === updateTodo._id ? updateTodo : todo
      ),
    }));
  },
}));

// 시도해본 결과들

// interface TodoState {
//   _id?: number;
//   title: string;
//   content: string;
//   done: boolean;
//   important: boolean;
//   deadline: string;
//   createdAt?: string;
//   updatedAt?: string;
// }

// import { immer } from "zustand/middleware/immer";

// interface TodoState {
//   items: TodoItem[];
// }

// interface TodoActions {
//   addItem: (val: TodoItem) => void;
//   removeItem: (val: TodoItem) => void;
//   editItem: (val: TodoItem) => void;
// }

// interface TodoAction {
//   type: keyof TodoActions;
//   payload: TodoItem;
// }

// export const useTodoStore = create()(
//   immer((set) => ({
//     items : [],
//     addItem : (newTodo:TodoItem) => set((state:any) => [...state, state.items : newTodo]),
//     removeItem : (id:TodoItem) => set((state:) => ),
//     eidtItem : (id,todo:TodoItem) => set((state:TodoState) => [...state, newTodo])
//   }))
// );

// const todoReducer = (state: TodoState, action: TodoAction): TodoState => {
//   switch (action.type) {
//     case "addItem":
//       return { ...state, items: [...state.items, action.payload] };
//     case "removeItem":
//       // eslint-disable-next-line no-case-declarations
//       const updatedItems = state.items.filter(
//         (item) => item._id !== action.payload._id
//       );
//       return { ...state, items: updatedItems };
//     case "editItem":
//       // eslint-disable-next-line no-case-declarations
//       const updatedList = state.items.map((item) =>
//         item._id === action.payload._id ? action.payload : item
//       );
//       return { ...state, items: updatedList };
//     default:
//       return state;
//   }
// };

// export const useStore = create<TodoState>((set) => ({
//   items: [],
//   dispatch: (args: TodoAction) =>
//     set((state: TodoState) => todoReducer(state, args)),
// }));
