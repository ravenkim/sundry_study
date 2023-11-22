import client from "api/client";

export const getChartList = (formData) =>
  client.post(`/search/get_chart_list`, formData);

