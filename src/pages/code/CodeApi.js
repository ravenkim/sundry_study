import client from "api/client"


export const getCodeList = () => {
    return client.get("manage/codetest/")
}