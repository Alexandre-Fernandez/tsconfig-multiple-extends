#!/usr/bin/env node
import { resolve } from "path"
import Tsconfig from "../classes/Tsconfig"

const CMD = "tsconfig-multiple-extends"

const args = {
	path: "",
	extends: [] as string[],
	noResolve: false,
	save: undefined as string | undefined,
}

let mode: keyof typeof args = "path"
for (const arg of process.argv.slice(2)) {
	if (arg === "--extends" || arg === "-xt") {
		mode = "extends"
		continue
	}
	if (arg === "--noResolve" || arg === "-nr") {
		args.noResolve = true
		continue
	}
	if (arg === "--save" || arg === "-sv") {
		mode = "save"
		continue
	}
	switch (mode) {
		case "path":
			if (!args.path) args.path = arg
			break
		case "extends":
			args.extends.push(arg)
			break
		case "save":
			if (!args.save) args.save = arg
			break
		default:
			throw new Error("Invalid command.")
	}
}

if (args.path) {
	if (args.extends.length > 0) {
		const extendedConfig = args.extends.reduce(
			(prev, path) =>
				prev.addExtends(resolve(".", path), !args.noResolve),
			new Tsconfig(args.path)
		)
		extendedConfig.save(args.save)
	} else {
		console.error(
			`Error: Provide tsconfig.json paths to extend "${args.path}", using the --extends option`
		)
		console.log(
			`Example: \n  ${CMD} ${args.path} --extends [path1] [path2] \n  ${CMD} ${args.path} --xt [path1] [path2]`
		)
	}
} else {
	console.error("Error: Provide the path to the tsconfig.json to extend.")
	console.log(
		`Example: \n  ${CMD} [path1] --extends [path2] [path3] \n  ${CMD} [path1] --xt [path2] [path3]`
	)
}
