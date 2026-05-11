import client from 'src/api/client.jsx'

const login = async (loginId, password) => {
    try {
        // POST 요청 보내기
        const response = await client.post('/login', {
            username: loginId,
            password: password,
        });

        // 응답 데이터 저장
        const responseData = response.data;

        // 예제로 콘솔에 출력
        console.log('로그인 성공:', responseData);

        // 필요시 반환
        return responseData;
    } catch (error) {
        // 오류 처리
        console.error('로그인 실패:', error.response ? error.response.data : error.message);
    }
}

const logout = () => {

}