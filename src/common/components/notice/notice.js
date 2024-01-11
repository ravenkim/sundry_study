import {notification} from 'antd';


// type
// 'success', 'error', 'warning'



const showMessage = (type, message) => {
  notification[type]({
    message: message,
    duration: 1.3, // 메시지가 표시될 시간 (초 단위)
  });
};

export default showMessage;
