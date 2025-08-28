// babel.config.js
module.exports = {
    presets: [
        [
            '@babel/preset-env',
            {
                // Target specific browser environments (e.g., last 2 versions of major browsers, or specific ones)
                targets: {
                    browsers: '> 0.25%, not dead', // Example: covers most modern browsers
                    // or specify specific browser versions
                    // chrome: '58',
                    // ie: '11',
                },
                // Enables automatic polyfilling based on usage and targets
                // 'usage' adds polyfills only when used, 'entry' requires manual imports in entry file
                useBuiltIns: 'usage',
                corejs: { version: 3, proposals: true }, // Specify core-js version and allow proposals
            },
        ],
        '@babel/preset-typescript', // Must be placed after @babel/preset-env for correct order
        // If you are using React:
        // ['@babel/preset-react', { runtime: 'automatic' }] // For new JSX transform
    ],
    plugins: [
        // Add any specific Babel plugins you need
        // For example, for class properties if not handled by preset-env:
        // '@babel/plugin-proposal-class-properties',
        // For decorators (ensure plugin-proposal-decorators is before class-properties)
        // ['@babel/plugin-proposal-decorators', { legacy: true }],
    ],
};
