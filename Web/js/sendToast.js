export function sendToast(text) {
    new Toast({
        title: "Предупреждение...",
        text: text,
        theme: 'danger',
        autohide: true,
        interval: 10000
    });
}