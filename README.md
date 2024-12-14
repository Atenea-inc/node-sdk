# 🌮 Atenea Node SDK

This is the Node SDK for the Atenea License API, it is a simple way to validate licenses and get information about them.

## 🚀 Getting Started

`1.` First of all, you need to install the library:

```bash
bun install @ateneacc/node-sdk
```

`2.` Then, you need to import the library and use it:

```ts
import { ApiClient } from "@ateneacc/node-sdk";

const client = new ApiClient({
	apiKey: "YOUR_API_KEY",
	baseUrl: "https://api.atenea.cc",
});
```

`3.` You can now use the library to validate licenses and get information about them:

```ts
const { license, status } = await client.validateLicense({
	license: "W1ZSQ-L9WG3-GP7MF-GRZIG-UEZPF",
	application: "846a94d5-c21e-44b3-ae26-ba7e4dcfdc9c",
});

if (status !== LicenseStatus.VALID) {
	console.log("License is invalid");
	process.exit(1);
}

console.log("License is valid");
console.log(license);
```

`4.` If the license is valid, you will receive the license information and the status of the license.

## 🤝 Contributing

We're open to any contributions, feel free to open an issue or a pull request.

## 📄 License

This project is licensed under the [GPL-3.0-only](LICENSE) license.
