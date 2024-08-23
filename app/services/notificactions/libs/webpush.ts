import webpush from "web-push";
import enviroments from "~/config/enviroments.config";
webpush.setVapidDetails(
	`mailto:${enviroments.VITE_PLUBIC_VAPID_EMAIL}`,
	enviroments.VITE_PLUBIC_VAPID_KEY,
	enviroments.VITE_PRIVATE_VAPID_KEY,
);
export default webpush;
