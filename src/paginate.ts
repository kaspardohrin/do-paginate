/**
 * create a list of incremental numbers with custom indexing, offsetting and items per page
 *
 * @param {number} current_index - the current, active page-number
 * @param {number} items_per_page - the amount of items you're showing per page
 * @param {number} items_total - the total amount of items or limit
 * @param {number} offset - amount of page-numbers to display before and after active page-number
 */
export default function paginate(
  index_current: number,
  items_per_page: number,
  items_total: number,
  offset: number,
): Array<number> {

  // cap at 1 for <1 and 1e15 for >1e15
  const f_index_current: number =
    (!+index_current || index_current < 1)
      ? 1
      : (index_current > 1e15)
        ? 1e15
        : index_current
  // cap at 1 for <1 and 1e50 for >1e50
  const f_items_per_page: number =
    (!+items_per_page || items_per_page < 1)
      ? 1
      : (items_per_page > 1e50)
        ? 1e50
        : items_per_page
  // cap at 1 for <1 and 1e50 for >1e50
  const f_items_total: number =
    (!+items_total || items_total < 1)
      ? 1
      : (items_total > 1e50)
        ? 1e50
        : items_total
  const f_offset: number =
    (!+offset || offset < 1)
      ? 1
      : (offset > 1e5)
        ? 1e5
        : offset

  // empty array to store page-numbers in
  const page_numbers: Array<number> = new Array<number>()

  // round up to handle rest values
  const n_pages: number = Math.ceil(f_items_total / f_items_per_page)

  // increment per one starting from starting: (index - offset) to ending: (index + offset) and add each increment to array
  for (let n: number = Math.floor(f_index_current - f_offset); n <= Math.floor(f_index_current + f_offset); ++n)
    page_numbers.push(n)

  // correct under- and upper -bound entries from first array by replacing them
  const shifted: Array<number> = page_numbers.map(
    (x: number, i: number, o: Array<number>) => {
      // x is 0 or negative number
      if (x < 1)
        // subtract one from x (which is negative or 0) and subtract this value from the highest element in the array (-- equals +), i.e., [-1,0,1,2,3] => [3-(-1-1), 3-(-0-1), 1,2,3] => [5, 4, 1,2,3]
        return (o?.[o.length - 1] - (x - 1))
      // x is higher than the total amount of pages
      if (x > n_pages)
        // subtract i from max pages, i.e., [98,99,100,101,102] => [98,99,100, 100-3, 100-4] => [98,99,100, 97, 96]
        return (n_pages - i)
      // do nothing
      return x
    })
    // upper and lower bound sometimes overlap with higher offsets in combination with low total item numbers, when this is the case, subtract two and convert negative numbers to positive, for some reason that works :)
    .map(
      (x: number) =>
        (x < 1) ? -(x - 2) : x)

  // ..though, this does sometimes create duplicate entries, which we will filter out here
  const seen: Set<number> = new Set<number>()

  const corrected: Array<number> =
    shifted.filter(
      (x: number) =>
        seen.has(x) ? false : seen.add(x)
    )

  // return sorted array, with a slice that only slices the page numbers when we dont have enough items to display for the page-offset we desire
  return corrected.sort(
    (a: number, b: number) => a - b
  ).slice(0, n_pages)
}
