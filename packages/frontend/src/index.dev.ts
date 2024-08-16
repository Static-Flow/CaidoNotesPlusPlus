import type { API } from "backend";
import type { BaseRequest } from "shared";
import { defineApp } from "./app";
import type { CaidoSDK } from "./types/sdk";
import { clone } from "./utils";

// This is a mock backend for the SDK
// This is only for development purposes
const requests: BaseRequest[] = [];

const backend: API = {
	getRoles: () => {
		return [];
	},
	addRole: (name) => {
		return {
			id: Math.random().toString(),
			name,
			description: "",
		};
	},
	updateRole: (id, fields) => {
		return clone({
			id,
			...fields,
		});
	},
	deleteRole: (id) => {},
	getUsers: () => {
		return [];
	},
	addUser: (name) => {
		return {
			id: Math.random().toString(),
			name,
			roles: [],
			attributes: [],
		};
	},
	updateUser: (id, fields) => {
		return clone({
			id,
			...fields,
		});
	},
	deleteUser: (id) => {},
	getRequests: () => {
		return requests;
	},
	addRequest: () => {
		const newRequest = {
			id: Math.random().toString(),
			method: "GET",
			host: "localhost",
			path: "/",
			port: 80,
			protocol: "http" as const,
			roleIds: [],
			userIds: [],
		};

		requests.push(newRequest);

		return newRequest;
	},
	deleteRequest: (id) => {
		const index = requests.findIndex((request) => request.id === id);
		if (index !== -1) {
			requests.splice(index, 1);
		}
	},
	toggleRequestRole: (requestId, roleId) => {
		const request = requests.find((request) => request.id === requestId);

		if (request) {
			const newRequest = clone(request);
			const isEnabled = newRequest.roleIds.includes(roleId);

			if (isEnabled) {
				newRequest.roleIds = newRequest.roleIds.filter((id) => id !== roleId);
			} else {
				newRequest.roleIds.push(roleId);
			}

			requests.splice(
				requests.findIndex((request) => request.id === requestId),
				1,
				newRequest,
			);

			return newRequest;
		}
	},
	toggleRequestUser: (requestId, userId) => {
		const request = requests.find((request) => request.id === requestId);

		if (request) {
			const newRequest = clone(request);
			const isEnabled = newRequest.userIds.includes(userId);

			if (isEnabled) {
				newRequest.userIds = newRequest.userIds.filter((id) => id !== userId);
			} else {
				newRequest.userIds.push(userId);
			}

			requests.splice(
				requests.findIndex((request) => request.id === requestId),
				1,
				newRequest,
			);

			return newRequest;
		}
	},
};

const app = defineApp({
	backend,
} as unknown as CaidoSDK);

app.mount("#app");
