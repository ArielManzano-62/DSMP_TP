export default NotificationReducer = (notificationList = [], action) => {
    switch(action.type){
        case 'NEW_NOTIFICATION': {
            return [action.payload, ...notificationList]
        }
        case 'REMOVE_NOTIFICATION': {
            return notificationList.filter(element => element.id !== action.payload);
        }
        default: {
            return notificationList;
        }
    }
}