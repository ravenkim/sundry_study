import client from "api/client";

export const getMemberList = (param) => {
    let url;
    param.keyword ? url=`/manage/member/?filterType=${param.filterType ? param.filterType : "all"}&keyword=${param.keyword}` : url=`/manage/member/?filterType=${param.filterType ? param.filterType : "all"}`
    return client.get(url);
}

export const getMember = (param) => {
    return client.get(`/manage/member/${param.memberKey}`);
};

export const insertMember = (formData) => client.post(`/manage/member/`,formData);

export const insertMemberIp = (formData) => client.post(`/manage/ip/`, formData);

export const deleteMember = (param) => client.delete(`/manage/member/${param}`)

export const updateMember = (formData) => client.put(`/manage/member/${formData.id}`, formData);

export const updateMemberProfile = (formData) => client.put(`/manage/profile-update/`, formData);

export const memberAutoMigrate = (formData) => client.post('/tipa/auto_migrate', formData);