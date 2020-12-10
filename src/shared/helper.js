export const validate = (type, value, anotherValue = null) => {
    let isValid, errorMessage;
    if (type === "email") {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        isValid = re.test(String(value).toLowerCase());
        errorMessage = isValid ? '' : "아이디(이메일)는 이메일 형식으로 입력해주세요."
    } else if (type === "password") {
        const re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
        isValid = re.test(String(value));
        errorMessage = isValid ? '' : "비밀번호는 영문+숫자 6자이상"
    } else if (type === 'confirmPassword') {
        isValid = value === anotherValue;
        errorMessage = isValid ? '' : "비밀번호가 일치하지 않습니다"
    } else if (type === 'phoneNumber') {
        const re = /^01([0|1|6|7|8|9]?)-?([0-9]{3,4})-?([0-9]{4})$/;
        isValid = re.test(String(value));
        errorMessage = isValid ? '' : "올바른 핸드폰번호를 입력해주세요."
    } else if (type === 'username') {
        isValid = value.length > 0;
        errorMessage = isValid ? '' : "이름을 입력해주세요"
    } else if (type === 'verificationNumber') {
        isValid = value.length === 6;
        errorMessage = isValid ? '' : "인증번호는 6자리입니다"
    }
    return { isValid: isValid, errorMessage: errorMessage };
}