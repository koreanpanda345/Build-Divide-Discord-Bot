import { glob } from "glob";

export async function LoadFiles(dirs: string[]) {
	for(const dir of dirs) {
		const files = glob.sync(`**/${dir}/**/*.ts`);
		for(const file of files) {
			await import(`../../${file}`);
		}
	}
}