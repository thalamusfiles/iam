module.exports = api => {
    api.cache(true);
    return {
      plugins: [
        ["@babel/plugin-proposal-class-properties", { "loose": true }],
        ["@babel/plugin-proposal-decorators", { "legacy": true }]
      ],
      presets: [
          "@babel/preset-env",
          "@babel/preset-react"
      ]
    }
}