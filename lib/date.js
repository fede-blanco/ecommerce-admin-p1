export default function prettyDate(dateStr) {
  return new Date(dateStr).toLocaleString().replace(",", " ")
}
