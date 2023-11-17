import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

interface PageType {
  [key: string]: string;
  info: string;
  regist: string;
  edit: string;
}

const page = (pageText: string, _id?: string | null): string => {
  const text: PageType = {
    info: `${_id}번째 할 일`,
    regist: "새로운 할일 등록하기",
    edit: "수정하기",
  };
  return text[pageText] || "TODOLIST";
};

const Header: React.FC = () => {
  const location = useLocation();
  const pathname = location.pathname.replace("/", "");
  const queryParams = new URLSearchParams(location.search);
  const _id = queryParams.get("_id");

  const [title, setTitle] = useState("");

  useEffect(() => {
    setTitle(page(pathname, _id));
  }, [pathname, _id]);

  return (
    <header>
      <h1>{title}</h1>
    </header>
  );
};

export default Header;
