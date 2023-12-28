// 권한 이쁘게
export const removeRole = (data) => {
    return data?.map(user => {
        return {
            ...user,
            authNm: user.authNm.replace('ROLE', '').replace(/_/g, ' ').trim()
        }
    });
}
// export const removeRole = (data) => {
//     if (Array.isArray(data)) {
//         return data.map(user => {
//             return {
//                 ...user,
//                 authNm: user.authNm.replace('ROLE', '').replace(/_/g, ' ').trim()
//             }
//         });
//     } else if (typeof data === 'object' && data !== null) {
//         return {
//             ...data,
//             authNm: data.authNm.replace('ROLE', '').replace(/_/g, ' ').trim()
//         }
//     }
// }


export const formatDate = (dateString) => {
    const options = {year: 'numeric', month: '2-digit', day: '2-digit'};
    const event = new Date(dateString);
    return event.toLocaleDateString('ko-KR', options).replace(/. /g, '년 ').replace('. ', '월 ').replace('.', '일');
}
