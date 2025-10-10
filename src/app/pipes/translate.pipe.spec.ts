import { AppTranslatePipe } from "./translate.pipe";

describe("AppTranslatePipe", () => {
	it("create an instance", () => {
		const pipe = new AppTranslatePipe({} as any);
		expect(pipe).toBeTruthy();
	});
});
