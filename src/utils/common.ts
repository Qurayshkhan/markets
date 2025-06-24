export const isNotEmpty = (item: any) => {
  return item !== undefined && item !== null && item !== "" && item.length !== 0
}

export const truncateString = (text: any, ellipsisString: string) => {
  return (text || "").length > ellipsisString
    ? text.substring(0, ellipsisString) + "..."
    : text
}

export const truncate = (n: any, digits: any) => {
  if (!n) return 0

  let re = new RegExp("(\\d+\\.\\d{" + digits + "})(\\d)"),
    m = n.toString().match(re)
  return m ? parseFloat(m[1]) : n.valueOf()
}

export const getFullName = (user: any) => {
  if (!user) return ""
  let name = user.firstName
  if (user.lastName) name += " " + user.lastName

  return name
}

export const numberWithCommas = (x: any) => {
  if (!x) return 0
  return Number(String(x).replaceAll(",", "")).toLocaleString(undefined, {
    maximumFractionDigits: 2,
  })
}

export const objectToParams = (obj: any) => {
  let str = ""
  for (const key in obj) {
    if (obj[key] !== undefined && obj[key] !== null) {
      if (str != "") {
        str += "&"
      }
      str += key + "=" + encodeURIComponent(obj[key])
    }
  }
  return str
}

export const removeDuplicateRow = (array: any) => {
  return array.filter(
    (item: any, index: number) => array.indexOf(item) === index
  )
}

export const toTitleCase = (phrase: string) => {
  if (!phrase) return ""

  return phrase
    .toLowerCase()
    .replace("_", " ")
    .split(" ")
    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

export const timeoutPromise = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const roundNumber = (num: number) => {
  return Math.round((num + Number.EPSILON) * 100) / 100
}

export const generateId = (prefix = "", length = 7) => {
  let result = prefix
  for (let i = 0; i < length; i++) {
    const random = Math.random()
    result += String.fromCharCode(
      Math.floor(random * 26) + (random < 0.5 ? 65 : 97)
    )
  }
  return result.toUpperCase()
}

export const calculateDiscount = (value: number, discount: number) => {
  if (!discount || discount === 0) return discount
  return (value * discount) / 100
}

export const pad = (num: number | string, size = 6) => {
  // Pad a number with leading zeros
  let s = num + ""
  while (s.length < size) s = "0" + s
  return s
}

export const calculateTableTotal = (rows: any, field: string) => {
  const total = rows.reduce((acc: number, row: any) => acc + row[field], 0)
  return numberWithCommas(total)
}

export const downloadCSVFile = (
  data: any[],
  headers: { key: string; label: string }[],
  fileName: string
) => {
  const csvData: string[] = []

  // Add headers
  csvData.push(headers.map((header: any) => header.label).join(","))

  // Add rows
  data.forEach((row: any) => {
    csvData.push(headers.map((header: any) => row[header.key]).join(","))
  })

  const csv = csvData.join("\n")

  // Download CSV file
  const blob = new Blob([csv], { type: "text/csv" })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.setAttribute("href", url)
  link.setAttribute("download", fileName)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export const downloadFile = (url: string, fileName: string) => {
  // for non-IE
  const req = new XMLHttpRequest()
  req.open("GET", url, true)
  req.responseType = "blob"
  req.onload = function () {
    //Convert the Byte Data to BLOB object.
    const blob = new Blob([req.response], { type: "application/octetstream" })

    //Check the Browser type and download the File.
    const isIE = false || !!document.DOCUMENT_NODE
    if (isIE) {
      // window.navigator.msSaveBlob(blob, fileName)
    } else {
      const url = window.URL || window.webkitURL
      const link = url.createObjectURL(blob)
      const a = document.createElement("a")
      a.setAttribute("download", fileName)
      a.setAttribute("href", link)
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    }
  }
  req.send()
}

export const simpleFileDownload = (url: string, name: string) => {
  let a = document.createElement("a")
  a.href = url
  a.setAttribute("download", name)
  a.setAttribute("target", "_blank")
  a.click()
}

export const getMediaName = (media: any) => {
  if (!media) return ""
  const parts = media.split("/")
  return parts[parts.length - 1]
}
