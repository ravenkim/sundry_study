export function isValidNicknameFormat(nickname: string): boolean {
    return /^[가-힣a-zA-Z0-9]{2,20}$/.test(nickname.trim())
}
