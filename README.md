# paginate
create an array with numbers in incremental order with the current index in the middle of the sequence, and the sequence always being the same length, no matter the index passed in

## installation
```bash
  $ npm install do-paginate # or

  $ yarn add do-paginate
```

## technologies
* node: 14.16.0
* typescript: 4.2.3
* npm: 6.14.11
* yarn: 1.22.10

## code-examples
import the pagination -file and pass in your parameters
```typescript
  // typescript
  import paginate from 'do-paginate'

  const index: number = 5
  const items_per_page: number = 25
  const items_total: number = 5000

  const sequence: Array<number> = paginate(index, items_per_page, items_total) // [ 1,2,3,4,5,6,7,8,9,10,11 ]
```
```javascript
  // javascript
  const paginate = require('do-paginate')

  const index = 5
  const items_per_page = 25
  const items_total = 5000

  const sequence = paginate(index, items_per_page, items_total) // [ 1,2,3,4,5,6,7,8,9,10,11 ]
```
```typescript
  // typescript example with express route
  import express from 'express'
  import paginate from 'do-paginate'
  import cors from 'cors'

  const app = express()

  app.use(
    cors({ origin: '*' }),
  )

  app.get('/', async (_, res) => res.send('<a href=\'/index=1&limit=25\'>test pagination</a>'))

  // request url: ?index=1&limit=25
  app.get('/index=:index?&limit=:limit?', async (req, res) => {
    const d_index: number = 1  // default index if none passed in for example
    const d_limit: number = 25 // default limit if none passed in for example
    const offset: number = 5   // pages to generate

    // get index from url, else fallback to d_index
    const index: number = +(req.params?.['index'] as string)?.replace(/[^\d-]/gm, '') || d_index
    // get limit from url, else fallback to d_limit
    const limit: number = +(req.params?.['limit'] as string)?.replace(/[^\d-]/gm, '') || d_limit

    const items_total: number = 5000 // TODO: get total items

    const pages: Array<number> = paginate(index, limit, items_total, offset)

    const documents: unknown = null // TODO: query database based on: index, limit

    res.send(
      pages.map(
        (x: number, _: number) =>
          `<a href='/index=${x}&limit=${limit}'>${x}</a>`
      )
        .join('\n')
    )
  })

  app.listen(
    process.env.PORT || 8000,
    () => {
      console.info(`Server started on port ${process.env.PORT || 8000}`)
    }
  )
```

## properties
| name | type | description |
|---|---|---|
| `current_index` | `number` | **required**. the page number that should appear in the middle of the pagination-sequence.<br><br>*example*: when your index is 10 and your offset is 5 all pages from 5-15 will be shown where 10 will appear in the middle. |
| `items_per_page` | `number` | **required**. the amount of items you're displaying on each page. |
| `items_total` | `number` | **required**. the length of your data. This value will determine how many pages can be generated.  |
| `offset` | `number` | **required**. limit the amount of pages shown by adding the offset parameter. This generated pagination sequence will contain all pages before and after the index based on the offset.<br><br>*example*: when your index is 10 and your offset is 5 all pages from 5-15 will be shown. |

## the uniqueness of this pagination-method
  - the sequence will never contain numbers that could lead to pages being generated with no content to display on them - given the parameters passed in are correct. for example, lets say the index is based on a parameter in an url, and the user changes the index value to 5000000, but you have a total of 5000 items to display with each page containing 25 items, then the sequence generated will end at 200, because at index 201 you'd have an empty page
  - takes a couple ms to generate

## license
MIT
