module.exports = {
    preset: '@lwc/jest-preset',
    testMatch: ['**/__test__/**/?(*.)(spec|test).js'],
    moduleNameMapper: {
        "^component-emitter$": "component-emitter",
        "^(base|component|rcast|view|store)(.+)$": "<rootDir>/src/client/modules/$1/$2/$2"
    }
}
