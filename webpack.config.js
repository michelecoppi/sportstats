const path = require('path');
module.exports = {
    resolve: {
        extensions: ['.js', '.jsx'],
        modules: [path.resolve(__dirname, 'src'), 'node_modules'],
        alias: {
          components: path.resolve(__dirname, 'src/components')
        },
        fallback : {
          "buffer": require.resolve("buffer/"),
          "http": require.resolve("stream-http"),
          "https": require.resolve("https-browserify"),
          "timers": require.resolve("timers-browserify"),
          "path": require.resolve("path-browserify"),
          "stream": require.resolve("stream-browserify"),
          "crypto": require.resolve("crypto-browserify"),
          "assert": require.resolve("assert/"),
          "zlib": require.resolve("browserify-zlib"),
          "util": require.resolve("util/"),
          "os": require.resolve("os-browserify/browser"),
         "process": require.resolve("process/browser"),
          fs : false,
          net : false,
          tls : false,
          child_process : false,
        },
      },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader'
          },
          
        },
        {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env', '@babel/preset-react']
              }
            }
          },
          {
            test: /\.css$/i,
            use: ['style-loader', 'css-loader'],
          },
      ]
    },
    plugins : [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
        // ...
      }),
    ],
  
  };