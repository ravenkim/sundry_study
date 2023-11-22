/**
 * 시간 : 2022-06-03
 * 작성자 : 김명훈
 **/


import client from "api/client";

export const getStatList= (params) =>
  client.get(`/tipa/get_stat_list`);
