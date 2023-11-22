import client from "api/client"

const sampleApi = {
    getCodeList: () => {
        return client.get("manage/codetest/")
    },
};

export default sampleApi




