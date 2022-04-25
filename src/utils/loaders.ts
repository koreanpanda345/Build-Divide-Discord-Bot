import { glob } from "glob";

export async function LoadFiles(dirs: string[]) {
	for(const dir of dirs) {
		const files = glob.sync(`**/${dir}/**/*.js`);
		for(const file of files) {
			await import(`../../${file}`);
		}
	}
}