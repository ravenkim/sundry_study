// 권한 이쁘게
export const removeRole = (data) => {
    return data?.map(user => {
        return {
            ...user,
            authNm: user.authNm.replace('ROLE', '').replace(/_/g, ' ')
        }
    });
}
