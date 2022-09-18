import { writeFileSync } from "fs"
import { resolve } from "path"
import {
	fillProperties,
	formatTsconfigJson,
	getJsonFile,
	getPoppedPath,
} from "../functions"

class Tsconfig {
	private config: Record<string, unknown> = {}

	constructor(private path: string) {
		const tsconfig = getJsonFile(path)

		for (const key in tsconfig) {
			this.config[key] = tsconfig[key]
		}
	}

	/**
	 * Extends the given `tsconfig.json` with `this`.
	 * @param path A path to the `tsconfig.json`
	 * @param resolveExtends If set to true it will also try to add
	 * all the properties from the extended tsconfigs recursively.
	 * **WARNING**: This will only works with relative paths.
	 */
	addExtends(path: string, resolveExtends = true) {
		const extendedConfig = getJsonFile(path)
		fillProperties(this.config, extendedConfig)
		if (resolveExtends && extendedConfig.extends) {
			this.addExtends(
				resolve(getPoppedPath(path), extendedConfig.extends)
			)
		}
		return this
	}

	/**
	 * @returns The JSON corresponding to the current `Tsconfig`.
	 */
	toJSON() {
		return formatTsconfigJson(JSON.stringify(this.config))
	}

	/**
	 * Saves the file as JSON to `path`.
	 * @param path Equal to the original constructor path by default.
	 */
	save(path = this.path) {
		writeFileSync(resolve(path), this.toJSON())
	}
}

export default Tsconfig
