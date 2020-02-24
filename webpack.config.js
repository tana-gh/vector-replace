const path = require('path')

module.exports = env => {
    const mode = env.dev  ? 'development' :
                 env.prod ? 'production'  :
                            ''
    
    if (mode === '') {
        throw 'must specify --env.dev or --env.prod'
    }

    return {
        target: 'node',
        mode: mode,
        entry: './src/extension.ts',
        output: {
            path: path.resolve(__dirname, `./dist/`),
            filename: 'extension.js',
            libraryTarget: 'commonjs2',
            devtoolModuleFilenameTemplate: '../[resource-path]'
        },
        externals: {
            vscode: 'commonjs vscode'
        },
        devtool: 'source-map',
        resolve: {
            extensions: ['.js', '.ts']
        },
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    exclude: /node_modules/,
                    use: [
                        {
                            loader: 'ts-loader'
                        }
                    ]
                }
            ]
        }
    }
}
