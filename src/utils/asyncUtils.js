
//reducer data 상테 
export const reducerUtils = {
    init: () => ({
        data: null,
        loading: false,
        error: false,
        errorMessage: null,
    }),

    loading: (prevData = null) => ({
        data: prevData,
        loading: true,
        error: false,
        errorMessage: null,
    }),

    success: (data = null) => ({
        data: data,
        loading: false,
        error: false,
        errorMessage: null,
    }),

    error: (error) => ({
        data: null,
        loading: false,
        error: true,
        errorMessage: error.msg,
    }),
}

//타입뒤 성공 했는지 실패 했는지
export const createActionString = (type) => {
    return { success: `${type}Success`, error: `${type}Error` }
}