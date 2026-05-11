import client from "api/client";

export const getCacheData = () => {
  return client.get("/manage/cache/");
};
