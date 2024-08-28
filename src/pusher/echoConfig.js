import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

export function initializeEcho() {
    window.Echo = new Echo({
        broadcaster: 'pusher',
        key: '61b81b31e1b968bac959',
        cluster: 'ap1',
        forceTLS: true
    });

    window.Echo.connector.pusher.connection.bind('connected', () => {
        console.log('Pusher connected successfully');
    });

    // Return Echo instance if you need to use it elsewhere
    return window.Echo;
}
