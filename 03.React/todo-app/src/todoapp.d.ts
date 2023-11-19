// 기본 타입 지정
interface TodoItem {
  _id: number;
  title: string;
  content: string;
  done: boolean;
  important: boolean;
  deadline: string;
  createdAt: string;
  updatedAt: string;
}

type TodoList = TodoItem[];

interface TodoListResponse {
  ok: number;
  items: TodoItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface TodoErrorResponse {
  ok: number;
  error: {
    message: string;
  };
}

interface TodoResponse {
  ok?: number;
  item: TodoItem;
}

// list페이지 타입 설정
// 체크박스 리스트 타입
interface checkboxTypeI {
  checked: boolean; // 인풋요소가 가지고 있는 checked속성 값 타입 설정
  nextSibling: HTMLAnchorElement; // 인풋요소 옆 앵커요소 타입 설정
}
