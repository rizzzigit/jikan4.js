<p align="center"><img src="https://github.com/rizzzigit/jikan4.js/raw/main/Banner.png"/></p>

# Jikan4.js
  A Node.js wrapper for Jikan API v4.

## Installation
  > **Important:**
  > - The minimum Node.js version requirement for `Jikan4.js` is **v12.0.0**
  > - `Jikan4.js` is under development as well as Jikan v4 API.

  ```shell
  $ npm i jikan4.js
  ```

## Usage
  This is how to import the module. It depends on the type of your project.
 
  **ESModule import**
  ```javascript
  import Jikan from 'jikan4.js'
  ```
  **CommonJS require**
  ```javascript
  const Jikan = require('jikan4.js')
  ```

  This is how to get a resource. It returns `undefined` if the requested resource does not exist.

  **ES2020-compliant example**
  ```javascript
  const client = new Jikan.Client()
  async function printAnime (id) {
    const anime = await client.anime.get(id)

    console.log(anime ? `${anime.title} (#${anime.id})` : `Anime with ID ${id} does not exist.`)
  }

  printAnime(4)
  printAnime(5)
  ```

## Links
  - [Jikan4.js](https://www.npmjs.com/package/jikan4.js) ([source](https://github.com/rizzzigit/jikan4.js))
    - [Documentation](https://rizzzigit.github.io/jikan4.js)
  - [Jikan](https://jikan.moe/) ([source](https://github.com/jikan-me/website))
    - [REST API Docs](https://jikan.docs.apiary.io/) ([source](https://github.com/jikan-me/jikan-rest))
    - [PHP API Docs](https://docs.jikan.moe) ([source](https://github.com/jikan-me/jikan))
    - [Discord Server](http://discord.jikan.moe/)
