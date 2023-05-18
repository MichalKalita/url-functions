# URL Functions

[![](https://badgen.net/bundlephobia/minzip/url-functions)](https://bundlephobia.com/package/url-functions)

Simple functions to work with URL updates. No external dependencies. Types included.

Internally is used native URL class and URLQueryParams class.

## Installation
```bash
npm i url-functions
```

## Usage

### updateUrl
`updateUrl = (previousUrl) => (updateObject) => URL`

Function gets url and return next function. Next function gets object with parameters and return new URL object. It's clear function, URL input is not mutated.

`previousUrl` is string with url or URL object. 

`updateObject` have all parameters optional:
- `protocol?: string` - http/https/ftp or any other string
- `hostname?: string` - domain name, e.g. example.com
- `path?: string` - path, e.g. `/path/to/file`, `../file`, `file`
  - if path is not absolute (starts with `/`), it will be appended to previous path
  - `..` goes level up, `../..` goes 2 levels up, and so on. If higher level not exists, path will be root (`/`)
- `query?`: object with query parameters, supported types:
  - `null`, `undefined` - Is ignored and query parameter is not affected
  - `string` - Value is used as query string
  - `number` - Value is converted to string and used as query string
  - `boolean`
    - `true` - query parameter will be added without value, e.g. `?param`
    - `false` - query parameter will be removed
  - `array of string and numbers (string|number)[]` - Parameter with more values. Values can be only string or numbers, other types are skipped. `['hello', 1, 'world']` => `?param=hello&param=1&param=world`
  - `fn(actualValue) => newValue` - update function. Actual value is always `string` if exists and `null` if not exist. 
- `keepQuery: boolean` - Default is false. If true, all previous query parameters will be kept. If False, previous query will be removed.
- `hash?`: 
  - `string` - hash string, without `#`. Empty string will remove hash if exits in previous url. If you want to make link to hash in same page, the best solution is to use simple link tag `<a href="#hash">`
  - `fn(actual) => newHash` - update function. Actual value is always string (without `#` as first character). If actual hash not set, it will be empty string.

### createUrl
`createUrl = (options) => URL`

Options object have **required** `hostname`.

All others keys are compatible to `updateUrl` functions.
- `keepQuery` don't have effects
- `query` update functions input is always `null`
- `hash` update functions input is empty string

## Examples

### Functions return URL object
Use `.toString()` to make string from URL object, not string.
```js
updateUrl('https://example.com/folder/')({path: '..'}).toString() 
// -> https://example.com/
```

### Iterate page number in query:
Query update functions can be used to update query without reading actual value.
```js
const iterateNumber = (input: string | null) => Number(input || 1) + 1;

updateUrl('https://example.com/')({query: {page: iterateNumber}})
// -> https://example.com/?page=2

updateUrl('https://example.com/?page=2')({query: {page: iterateNumber}})
// -> https://example.com/?page=3
```

### Initialize with actual url in browser:
```js
const url = updateUrl(window.location.href);

const home = url({path: '/'});
const lvlUp = url({path: '..'});
const helloWorldInQuery = url({query: {hello: 'world'}});
```
