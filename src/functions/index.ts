import { readFileSync } from "fs"
import { resolve } from "path"

export function getJsonFile(path: string) {
	return JSON.parse(readFileSync(resolve(path), { encoding: "utf8" }))
}

/**
 * Adds recursively **BY REFERENCE** all the properties from `b` missing in `a`
 * to `a`.
 */
export function fillProperties(
	a: Record<string, unknown>,
	b: Record<string, unknown>
) {
	for (const key in b) {
		if (a[key] === undefined) a[key] = b[key]

		const typeofA = typeof a[key]
		if (typeofA !== typeof b[key]) continue

		if (typeofA === "object" && !Array.isArray(a[key])) {
			fillProperties(
				a[key] as Record<string, unknown>,
				b[key] as Record<string, unknown>
			)
		}
	}
}

export function getPoppedPath(path: string) {
	return path.split("/").slice(0, -1).join("/")
}

export function formatTsconfigJson(json: string) {
	let formatted = ""
	let indentation = 0
	let arrayNesting = 0
	const isArray = () => !!arrayNesting
	let isString = false

	for (let i = 0; i < json.length; i++) {
		switch (json[i]) {
			case '"':
				if (
					json?.[i - 1] === ":" ||
					(json?.[i - 1] === " " && json?.[i - 2] === ":")
				) {
					isString = true
				} else if (isString && json?.[i - 1] !== "\\") {
					isString = false
				}
				formatted += '"'
				break
			case "[":
				arrayNesting += 1
				formatted += "["
				break
			case "]":
				arrayNesting -= 1
				formatted += "]"
				break
			case "{":
				indentation += 1
				formatted += `{\n${"\t".repeat(indentation)}`
				break
			case "}":
				indentation -= 1
				formatted += `\n${"\t".repeat(indentation)}}`
				break
			case ",":
				if (isArray()) formatted += ", "
				else formatted += `,\n${"\t".repeat(indentation)}`
				break
			case ":":
				formatted += ":"
				if (!isString) formatted += " "
				break
			default:
				formatted += json[i]
		}
	}

	return `${formatted}\n`
}
