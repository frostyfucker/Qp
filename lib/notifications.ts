import { Task } from '../types';

const isBrowser = typeof window !== 'undefined';

/**
 * Requests permission from the user to send notifications.
 * This should be called based on a user interaction, e.g., a button click.
 */
export const requestNotificationPermission = async (): Promise<void> => {
    // Only run in the browser and if permission has not been granted or denied yet.
    if (isBrowser && 'Notification' in window && Notification.permission === 'default') {
        await Notification.requestPermission();
    }
};

/**
 * Schedules a browser notification for a given task.
 * The notification will be scheduled to appear 5 minutes before the task's start time.
 * @param task The task object for which to schedule a notification.
 */
export const scheduleNotification = (task: Task): void => {
    // Ensure this only runs in the browser where notifications are supported and permission has been granted.
    if (!isBrowser || !('Notification' in window) || Notification.permission !== 'granted' || !task.startTime) {
        return;
    }
    
    const [hours, minutes] = task.startTime.split(':').map(Number);
    const notificationTime = new Date(task.date);
    notificationTime.setHours(hours, minutes, 0, 0);

    const now = new Date();
    // Schedule notification to appear 5 minutes before the task starts
    const scheduledTime = new Date(notificationTime.getTime() - 5 * 60 * 1000);

    if (scheduledTime > now) {
        const timeout = scheduledTime.getTime() - now.getTime();
        setTimeout(() => {
            new Notification(`Upcoming Task: ${task.title}`, {
                body: `Starts at ${task.startTime}`,
                icon: '/favicon.ico', // You can replace this with a proper icon path
            });
        }, timeout);
    }
};