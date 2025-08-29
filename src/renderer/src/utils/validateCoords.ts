const regexLat = /^(\+|-)?(?:90(?:\.0{1,6})?|(?:[0-9]|[1-8][0-9])(?:\.[0-9]{1,15})?)$/
const regexLng = /^(\+|-)?(?:180(?:\.0{1,6})?|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:\.[0-9]{1,15})?)$/

export function validateLat(lat: string): boolean {
  return regexLat.test(lat)
}

export function validateLng(lng: string): boolean {
  return regexLng.test(lng)
}
