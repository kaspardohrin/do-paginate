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
        : Math.floor(index_current)
  // cap at 1 for <1 and 1e50 for >1e50
  const f_items_per_page: number =
    (!+items_per_page || items_per_page < 1)
      ? 1
      : (items_per_page > 1e50)
        ? 1e50
        : Math.floor(items_per_page)
  // cap at 1 for <1 and 1e50 for >1e50
  const f_items_total: number =
    (!+items_total || items_total < 1)
      ? 1
      : (items_total > 1e50)
        ? 1e50
        : Math.floor(items_total)
  // cap at 1 for <1 and 1e5 for >1e5
  const f_offset: number =
    (!+offset || offset < 1)
      ? 1
      : (offset > 1e5)
        ? 1e5
        : Math.floor(offset)

  const n_pages: number =
    (f_items_total / f_items_per_page < 1)
      ? 1
      : Math.ceil(f_items_total / f_items_per_page)

  // empty array to store page-numbers in
  const page_numbers: Array<number> = new Array<number>()
  // increment per one starting from starting: (index - offset) to ending: (index + offset) and add each increment to array
  for (let n: number = f_index_current - f_offset; n <= f_index_current + f_offset; n++)
    page_numbers.push(n)

  // correct under- and upper -bound entries
  const shifted: Array<number> = page_numbers.map(
    (x: number, i: number, o: Array<number>) => {
      // return last element + pos(x) + 1
      if (x < 1)
        return (o?.[o.length - 1] - (x - 1))

      if (x > n_pages && n_pages - i > 0)
        return n_pages - i

      return x
    })

  const filtered: Array<number> = shifted.filter(
    (x: number) => !(x > n_pages)
  )

  return filtered.sort(
    (a: number, b: number) => a - b
  )
}
