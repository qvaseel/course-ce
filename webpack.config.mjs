import path, { join } from "path"
import { fileURLToPath, pathToFileURL } from "url"
import HtmlWebpackPlugin from "html-webpack-plugin"
import fs from "fs"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const baseDir = path.resolve(__dirname, "./src")
const buildDir = path.resolve(__dirname, "./build")
const pagesDir = path.resolve(__dirname, "./src/pages")

const generatePages = async () => {
    const pagesFiles = fs.readdirSync(pagesDir)
    const plugins = await Promise.all(
        pagesFiles.filter((file) => file.endsWith(".js")).map(async (file) => {
            const pageName = file.split(".")[0]

            const template = import.meta.resolve(join(pagesDir, file))

            return new HtmlWebpackPlugin({
                filename: `${pageName}.html`,
                template,
            })
        })
    )
    return plugins;
}

export default async (env, { mode }) => {
    console.debug(mode, "env")
    const pages = await generatePages()
    return {
        mode,
        entry: path.join(baseDir, "app.js"),
        output: {
            path: buildDir,
            filename: "bundle.js",
            clean: true
        },
        plugins: [...pages]
    }
}