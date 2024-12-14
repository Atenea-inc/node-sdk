import {
	LicenseStatus,
	type ApiConfig,
	type ApiResponse,
	type HttpMethod,
	type License,
	type Payload,
	type ZodResponse,
} from "../types/api";

export class ApiError extends Error {
	constructor(
		public readonly data: ApiResponse,
		public readonly status: number,
	) {
		super(JSON.stringify(data));
		this.name = "AteneaApiError";
	}
}

export class ApiClient {
	private readonly baseUrl: string;
	private readonly apiKey: string;
	private readonly timeout: number;

	constructor(config: ApiConfig) {
		this.baseUrl = config.baseUrl.replace(/\/$/, "");
		this.apiKey = config.apiKey;
		this.timeout = config.timeout ?? 3000;
	}

	/**
	 * Validate a license
	 * @param payload - The payload to validate
	 * @returns The license
	 */
	async validateLicense(payload: Payload): Promise<{ license: License; status: LicenseStatus }> {
		const response = await this.request<License>("POST", "/api/client", payload);
		if (response.statusCode === 400 || response.statusCode === 404) {
			return { license: response.data, status: LicenseStatus.NOT_FOUND };
		}

		if (response.statusCode === 401) {
			return { license: response.data, status: LicenseStatus.INVALID };
		}

		if (response.statusCode === 402) {
			return { license: response.data, status: LicenseStatus.EXPIRED };
		}

		if (response.statusCode === 410) {
			return { license: response.data, status: LicenseStatus.EXPIRED };
		}

		if (response.statusCode === 429) {
			return { license: response.data, status: LicenseStatus.LIMIT_REACHED };
		}

		if (response.statusCode === 500) {
			return { license: response.data, status: LicenseStatus.INTERNAL_SERVER_ERROR };
		}

		return { license: response.data, status: LicenseStatus.VALID };
	}

	protected async request<T>(
		method: HttpMethod,
		endpoint: string,
		data?: unknown,
	): Promise<{ statusCode: number; data: T }> {
		const url = `${this.baseUrl}${endpoint}`;
		const headers = {
			Authorization: `Bearer ${this.apiKey}`,
			"Content-Type": "application/json",
		};

		try {
			const controller = new AbortController();
			const timeoutId = setTimeout(() => controller.abort(), this.timeout);

			const response = await fetch(url, {
				method,
				headers,
				body: data ? JSON.stringify(data) : undefined,
				signal: controller.signal,
			});

			clearTimeout(timeoutId);
			const responseData = (await response.json()) as ApiResponse<T> | ZodResponse;

			if ("error" in responseData && "issues" in responseData.error) {
				throw new ApiError({ status: 400, data: responseData.error.issues }, 400);
			}

			if (!("data" in responseData)) {
				throw new ApiError({ status: response.status, data: responseData }, response.status);
			}

			return { statusCode: response.status, data: responseData.data as T };
		} catch (error) {
			if (error instanceof ApiError) {
				throw error;
			}

			if (error instanceof Error) {
				throw new ApiError({ status: 500, data: error.message }, 500);
			}

			throw new ApiError({ status: 500, data: "Unknown error occurred" }, 500);
		}
	}
}
