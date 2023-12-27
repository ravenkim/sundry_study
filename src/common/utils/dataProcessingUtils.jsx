// 권한 이쁘게
export const removeRole = (data) => {
    return data?.map(user => {
        return {
            ...user,
            authNm: user.authNm.replace('ROLE', '').replace(/_/g, ' ').trim()
        }
    });
}


export const formatDate = (dateString) => {
    const options = {year: 'numeric', month: '2-digit', day: '2-digit'};
    const event = new Date(dateString);
    return event.toLocaleDateString('ko-KR', options).replace(/. /g, '년 ').replace('. ', '월 ').replace('.', '일');
}
