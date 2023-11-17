import axios from "axios";
import BaseUrl from "../BaseUrl";

// 추후 공통으로 적용할 url과 token을 전역으로 활용하기 위해서 생성

const axiosApi = (url: string) => {
  const instance = axios.create({ baseURL: url });
  return instance;
};

export const defaultInstance = axiosApi(BaseUrl);
