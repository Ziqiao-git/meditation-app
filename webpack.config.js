const path = require('path');

module.exports = {
  // Starting point for bundling
  entry: './src/client/index.js',
  
  // Where to output the bundled file
  output: {
    path: path.resolve(__dirname, 'src/public/dist'),
    filename: 'bundle.js',
    publicPath: '/dist/'
  },
  
  // Rules for processing different file types
  module: {
    rules: [
      {
        // Process .js and .jsx files
        test: /\.(js|jsx)$/,
        // Don't process node_modules
        exclude: /node_modules/,
        use: {
          // Use babel-loader to transform React/JSX
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      }
    ]
  },
  
  // Allow importing .js and .jsx files without specifying extension
  resolve: {
    extensions: ['.js', '.jsx']
  }
};