module.exports = {
    preset: '@lwc/jest-preset',
    testMatch: ['**/__test__/**/?(*.)(spec|test).js'],
    moduleNameMapper: {
        "^(base|component|rcast|view|store)(.+)$": "<rootDir>/src/client/modules/$1/$2/$2"
    }
}
