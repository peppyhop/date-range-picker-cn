import { describe, expect, it } from "vitest";
import { createRoot } from "react-dom/client";
import App from "./App";

async function nextTick() {
	await new Promise<void>((resolve) => {
		setTimeout(() => resolve(), 0);
	});
	await new Promise<void>((resolve) => {
		requestAnimationFrame(() => resolve());
	});
}

function renderApp() {
	const container = document.createElement("div");
	document.body.appendChild(container);
	const root = createRoot(container);
	root.render(<App />);
	return {
		container,
		unmount: () => {
			root.unmount();
			container.remove();
		},
	};
}

function findButtonByExactText(text: string) {
	return Array.from(document.querySelectorAll("button")).find((button) => {
		return button.textContent?.trim() === text;
	});
}

function parseJsonFromPreElements() {
	return Array.from(document.querySelectorAll("pre")).map((pre) => {
		const text = pre.textContent ?? "";
		return JSON.parse(text) as unknown;
	});
}

describe("date range picker demo", () => {
	it("omits compareDateRange in the JSON payload output", async () => {
		const { unmount } = renderApp();
		await nextTick();

		const payloads = parseJsonFromPreElements();
		expect(payloads.length).toBeGreaterThan(0);

		for (const payload of payloads) {
			expect(payload).toHaveProperty("dateRange");
			expect(payload).not.toHaveProperty("compareDateRange");
		}

		unmount();
	});

	it("applies a preset and updates payload without compareDateRange", async () => {
		const { unmount } = renderApp();
		await nextTick();

		const trigger = Array.from(document.querySelectorAll("button")).find((button) => {
			const text = button.textContent ?? "";
			return text.includes(" - ") && text.includes(",");
		});
		expect(trigger).toBeTruthy();
		trigger?.click();
		await nextTick();

		const todayButton = findButtonByExactText("Today");
		expect(todayButton).toBeTruthy();
		todayButton?.click();
		await nextTick();

		const updateButton = findButtonByExactText("Update");
		expect(updateButton).toBeTruthy();
		updateButton?.click();
		await nextTick();

		const payloads = parseJsonFromPreElements();
		expect(payloads.length).toBeGreaterThan(0);
		const firstPayload = payloads[0] as {
			dateRange: { from: string | null; to: string | null };
		};

		expect(firstPayload.dateRange.from).toBeTruthy();
		expect(firstPayload.dateRange.to).toBeTruthy();
		expect(firstPayload.dateRange.from).toBe(firstPayload.dateRange.to);
		expect(firstPayload).not.toHaveProperty("compareDateRange");

		unmount();
	});
});
