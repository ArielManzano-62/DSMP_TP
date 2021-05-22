export const newNotification = (notification) => {
    return {
        type: "NEW_NOTIFICATION",
        payload: notification
    }
}
export const removeNotification = (id) => {
    return {
        type: "REMOVE_NOTIFICATION",
        payload: id
    }
}