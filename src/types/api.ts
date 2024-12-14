export interface ApiResponse<T = unknown> {
	status: number;
	data?: T;
}

export interface ZodResponse {
	success: boolean;
	error: {
		issues: Array<{
			code: string;
			message: string;
			path: string[];
		}>;
		name: "ZodError";
	};
}

export interface ApiConfig {
	/** The base URL of the API */
	baseUrl: string;
	/** The API key */
	apiKey: string;
	/** The timeout for the API requests */
	timeout?: number;
}

export enum LicenseStatus {
	VALID = "valid",
	INVALID = "invalid",
	EXPIRED = "expired",
	LIMIT_REACHED = "limit_reached",
	NOT_FOUND = "not_found",
	INTERNAL_SERVER_ERROR = "internal_server_error",
}

/** HTTP Methods supported by the API */
export type HttpMethod = "GET" | "POST";

export interface License {
	license: string;
	id: string;
	user: string;
	createdAt: Date;
	appId: string;
	ipCap: number | null;
	ipList: string[] | null;
	hwidCap: number | null;
	hwidList: string[] | null;
	expiresAt: string | null;
}

export interface Payload {
	/** The license to validate */
	license: string;
	/** The application ID (valid uuidv4) */
	application: string;
	/** The HWID to validate */
	hwid?: string;
}
