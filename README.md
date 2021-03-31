
## Description
Tiny library to access the well-known spanish RAE dictionary programatically.

### Unofficial Library

### Installation
```bash
npm i @jodacame/raejs
```

### Usage
```js
const raejs = require('raejs');
const query = 'elefante';
const response = await raejs.search(query);
if(!response.error){
    console.log(response.results);
}
```
### Add custom RAE Host
This library jump cloudflare protection sending direct request to RAE server. If you need change host RAE server IP maybe you need use this method.
```js
const raejs = require('raejs');
raejs.addHost('XXX.XXX.XXX.XXX');
...
```
#### List Hosts
```js
const raejs = require('raejs');
const hosts = raejs.listHosts();
console.log(hosts);
...
```
#### Change host index
```js
const raejs = require('raejs');
raejs.setHost(1);
...
```