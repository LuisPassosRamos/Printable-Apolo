// WhatsApp configuration - change this number to configure
export const WHATSAPP_NUMBER = '5511946011210';

// AppSheet configuration (set these values in .env)
export const APPSHEET_APP_ID = (import.meta.env.VITE_APPSHEET_APP_ID ?? '').trim();
export const APPSHEET_APP_NAME = (import.meta.env.VITE_APPSHEET_APP_NAME ?? '').trim();
export const APPSHEET_TABLE_NAME = (import.meta.env.VITE_APPSHEET_TABLE_NAME ?? '').trim();
export const APPSHEET_ACCESS_KEY = (import.meta.env.VITE_APPSHEET_ACCESS_KEY ?? '').trim();

export const APPSHEET_ACTION_URL =
	APPSHEET_APP_ID && APPSHEET_TABLE_NAME
		? `https://api.appsheet.com/api/v2/apps/${APPSHEET_APP_ID}/tables/${encodeURIComponent(APPSHEET_TABLE_NAME)}/Action`
		: '';
