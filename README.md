# paginate
create an array with numbers in incremental order with the current index in the middle of the sequence, and the sequence always being the same length, no matter the index passed in

## installation
```bash
  $ npm install do-paginate

  $ yarn add do-paginate
```

## technologies
* node: 14.16.0
* typescript: 4.2.3
* npm: 6.14.11
* yarn: 1.22.10

## code-example
import the pagination -file and pass in your parameters
```typescript
  // typescript
  import paginate from 'do-paginate'

  const sequence: Array<number> = paginate(1, 25, 1000) // [ 1,2,3,4,5,6,7,8,9,10,11 ]
```
```javascript
  // javascript
  const paginate = require('do-paginate')

  const sequence = paginate(1, 25, 1000) // [ 1,2,3,4,5,6,7,8,9,10,11 ]
```

## the uniqueness of this pagination-method
  - the sequence will never contain numbers that could lead to pages being generated with no content to display on them - given the parameters passed in are correct. for example, lets say the index is based on a parameter in an url, and the user changes the index value to 5000000, but you have a total of 5000 items to display with each page containing 25 pages, then the sequence generated will end at 200, because at index 201 you'd have an empty page
  - takes a couple ms to generate

## basic usages
```typescript
  // the first parameter is the active page
  paginate(6, 10, 1000)    // output: [ 1,2,3,4,5, [6], 7,8,9,10,11 ]

  // the second parameter is the items you want to display per page
  paginate(1, 10, 1000)    // output: [ [1], 2,3,4,5,6,7,8,9,10,11 ]

  // the third parameter is summ of all items
  paginate(1, 10, 5000)    // output: [ [1], 2,3,4,5,6,7,8,9,10,11 ]

  // the fourth parameter is length of the sequence, where length equals: 2 * (offset + 1)
  paginate(1, 10, 1000, 7) // output: [ [1], 2,3,4,5,6,7,8,9,10,11,12,13,14,15 ]
```

## advanced usages
```typescript
  // lower-bound checking
  paginate(1, 10, 1000)   // [ [1], 2,3,4,5,6,7,8,9,10,11 ]
  // upper-bound checking
  paginate(100, 10, 1000) // [ 90,91,92,93,94,95,96,97,98,99, [100] ]

  // lower-out-of-bound checking for index
  paginate(-10, 10, 1000) // [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11 ]
  // upper-out-of-bound checking for index
  paginate(200, 10, 1000) // [ 90,91,92,93,94,95,96,97,98,99,100 ]

  // out-of-bound checking for content length
  paginate(1, 10, 25)     // [ [1], 2,3 ]

  // out-of-bound checking for content length and index simultaneously
  paginate(-10, 10, 25)   // [ 1,2,3 ]
  paginate( 10, 10, 25)   // [ 1,2,3 ]
```

## license
MIT
