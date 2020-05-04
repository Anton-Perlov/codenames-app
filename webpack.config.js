const path = require('path')
const HTMLWepackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
	context: path.resolve(__dirname,'src'),
	mode: 'development',
	entry: {
		main: './main.js'
	},
	output: {
		filename: '[name].[contenthash].js',
		path: path.resolve(__dirname, 'dist')
	},
	optimization: {
		splitChunks: {
			chunks: 'all'
		}
	},
	devServer: {
		https: false,
		port: 9000
	},
	// devtool: "#inline-source-map",
	plugins: [
		new HTMLWepackPlugin({
			template: './index.html'
		}),
		new CleanWebpackPlugin(),
		new CopyWebpackPlugin([
            {
				from:'images',
				to:'images'
			}
		])
	],
	module: {
		rules: [
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader']
			},
			{
				test: /\.(jpg|jpeg|png|gif|svg|bmp)$/,
				use: ['file-loader']
			},
			// {
			// 	test: /\.(map)$/,
			// 	use: ['file-loader']
			// }
		]
	}
}