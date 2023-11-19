import { ChangeEvent, useState, FormEvent } from "react";

import classes from "./SearchForm.module.css";

interface SearchBarType {
  placehordler: string;
  text: string;
  onSearch: (inputText: string) => void;
  setIsSearch: (isSearch: boolean) => void;
}

const SearchForm = (props: SearchBarType) => {
  const { onSearch, setIsSearch } = props;
  const [searchInput, setSearchInput] = useState("");

  //

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value.toLowerCase());
  };

  const handleSumbit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // console.log(searchInput);
    setIsSearch(true);
    onSearch(searchInput);
    // 초기화
    setSearchInput("");
  };
  return (
    <form onSubmit={handleSumbit} className={classes["search-container"]}>
      <input
        type="text"
        className={classes["search-bar"]}
        placeholder={props.placehordler}
        value={searchInput}
        required
        onChange={handleChange}
      />
      <button type="submit" className={classes.btn}>
        검색
      </button>
    </form>
  );
};

export default SearchForm;
