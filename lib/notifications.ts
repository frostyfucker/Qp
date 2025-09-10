import { Task } from '../types';

let permission: NotificationPermission | 'unsupported' = 'default';
if ('Notification' in window) {
    permission = Notification.permission;
} else {
    permission = 'unsupported';
}

export const requestNotificationPermission = async (): Promise<void> => {
    if (permission === 'default') {
        permission = await Notification.requestPermission();
    }
};

export const scheduleNotification = (task: Task): void => {
    if (permission !== 'granted' || !task.startTime) return;

    const [hours, minutes] = task.startTime.split(':').map(Number);
    const notificationTime = new Date(task.date);
    notificationTime.setHours(hours, minutes, 0, 0);

    const now = new Date();
    // Schedule notification 5 minutes before the task starts
    const scheduledTime = new Date(notificationTime.getTime() - 5 * 60 * 1000);

    if (scheduledTime > now) {
        const timeout = scheduledTime.getTime() - now.getTime();
        setTimeout(() => {
            new Notification(`Upcoming Task: ${task.title}`, {
                body: `Starts at ${task.startTime}`,
                icon: '/favicon.ico', // Optional: Add an icon
            });
        }, timeout);
    }
};
