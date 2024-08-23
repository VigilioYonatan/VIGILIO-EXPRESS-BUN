self.addEventListener("push", (event) => {
    const data = event.data.json();
    self.registration.showNotification(data.title, {
        body: data.message,
        icon: data.logo,
        data: { url: data.url },
        requireInteraction: true,
        vibrate: [100, 50, 100],
    });
});

self.addEventListener("notificationclick", (event) => {
    event.notification.close(); // Cierra la notificación

    const urlToOpen = event.notification.data.url;
    const promiseChain = clients
        .matchAll({
            type: "window",
            includeUncontrolled: true,
        })
        .then((windowClients) => {
            let matchingClient = null;

            for (let i = 0; i < windowClients.length; i++) {
                const windowClient = windowClients[i];
                if (windowClient.url === urlToOpen) {
                    matchingClient = windowClient;
                    break;
                }
            }

            if (matchingClient) {
                return matchingClient.focus();
            }
            return clients.openWindow(urlToOpen);
        });

    event.waitUntil(promiseChain);
});
