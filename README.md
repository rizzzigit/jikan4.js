<p align="center"><img src="https://github.com/rizzzigit/jikan4.js/raw/main/Banner.png"/></p>

# Jikan4.js
  A Node.js wrapper for Jikan API v4. Supports data caching and rate-limit handling.

## Installation
  > **Important:**
  > - The minimum Node.js version requirement for `Jikan4.js` is **v12.0.0**

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

  **Example**
  ```javascript
  const client = new Jikan.Client()
  async function printAnime (id) {
    const anime = await client.anime.get(id)

    console.log(anime ? `${anime.title} (#${anime.id})` : `Anime with ID ${id} does not exist.`)
  }

  printAnime(4)
  printAnime(5)
  ```

  Search for anime.
  ```javascript
  const client = new Jikan.Client()
  async function printSearch (searchString) {
    const result = (await client.anime.search(searchString)).map((anime) => {
      return {
        title: anime.title.default,
        year: anime.year
      }
    })

    console.table(result)
  }

  printSearch('naruto')
  ```

## Links
  - [Jikan4.js](https://www.npmjs.com/package/jikan4.js) ([source](https://github.com/rizzzigit/jikan4.js))
    - [Documentation](https://rizzzigit.github.io/jikan4.js/classes/Client.html)
  - [Jikan](https://jikan.moe/) ([source](https://github.com/jikan-me/website))
    - [REST API Docs](https://jikan.docs.apiary.io/) ([source](https://github.com/jikan-me/jikan-rest))
    - [PHP API Docs](https://docs.jikan.moe) ([source](https://github.com/jikan-me/jikan))
    - [Discord Server](http://discord.jikan.moe/)
