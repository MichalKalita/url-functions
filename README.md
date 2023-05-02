# URL Functions

All code is fully typed.

## Core functions

Internally is used native URL class and URLQueryParams class.
No dependencies.

### `updateUrl = (previousUrl) => (updateObject) => URL`
Function gets url and return next function. Next function gets object with parameters and return new URL object. It's clear function, it doesn't change input url.

`previousUrl` is string with url or URL object. 

`updateObject` have all parameters optional:
- `protocol?: string` - http/https/ftp or any other string
- `hostname?: string` - domain name, e.g. example.com
- `path?: string` - path, e.g. `/path/to/file`, `../file`, `file`
  - if path is not absolute (starts with `/`), it will be appended to previous path
  - `..` goes level up, `../..` goes 2 levels up, and so on. If higher level not exists, path will be root (`/`)
- `query?: object with update options` - if object is set, all existed queries will be overwritten. If you want to extend query, use `extendQuery: true` option.
  - `null`, `undefined` - Is ignored and query parameter is not affected
  - `string` - Value is used as query string
  - `number` - Value is converted to string and used as query string
  - `boolean`
    - `true` - query parameter will be added without value, e.g. `?param`
    - `false` - query parameter will be removed
  - `array of string and numbers (string|number)[]` - Parameter with more values. Values can be only string or numbers, other types are skipped. `['hello', 1, 'world']` => `?param=hello&param=1&param=world`
    - `fn(actualValue) => newValue` - callback to update existing value. Actual value is always `string` if exists and `null` if not exist. 
- `clearQuery: boolean` - Default is false. If true, all previous query parameters will be removed. If False, previous parameters will be kept.
- `hash?: string` - hash string, without `#`. Empty string will remove hash if exits in previous url. If you want to make link to hash in same page, the best solution is to use simple link tag `<a href="#hash">`

#### Examples
##### Maybe you want to clear query by default. Create a wrapper for updateUrl:
```js
const updateUrlWithDefaultExtend = (previousUrl) => (updateObject) => 
  updateUrl(previousUrl)(
    {
      ...updateObject, 
      clearQuery: true
    }
);
```

##### Iterate page number in query:
```js
const nextPage = (previousPage) => Math.min(1, Number(previousPage)) + 1;
const urlToNextPage = (previousUrl) => updateUrl(previousUrl)({query: {page: nextPage}});
```

##### Initialize with actual url in browser:
```js
const url = updateUrl(window.location.href);

const home = url({path: '/'});
const lvlUp = url({path: '..'});
const helloWorldInQuery = url({query: {hello: 'world'}});
```

##### String output instead of URL object:
```js
const url = updateUrl(window.location.href)({query: {hello: 'world'}}).toString();
```