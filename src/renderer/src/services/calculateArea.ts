import proj4 from 'proj4'

export function calculateArea(coords: { lat: number; lng: number }[]): number {
  proj4.defs('WGS84_UTM', '+proj=utm +zone=33 +ellps=WGS84 +datum=WGS84 +units=m +no_defs')

  if (coords.length < 3) return 0

  const coordsUTM: { x: number; y: number }[] = []
  for (let i = 0; i < coords.length; i++) {
    const coord = coords[i]

    const coordUTM = proj4(proj4.defs('WGS84'), proj4.defs('EPSG:3785'), [coord.lng, coord.lat])
    const data = {
      x: coordUTM[0],
      y: coordUTM[1]
    }

    coordsUTM.push(data)
  }

  let areaX = 0
  let areaY = 0
  for (let x = 1; x < coordsUTM.length; x++) {
    const product1 = coordsUTM[x - 1].y * coordsUTM[x].x
    areaX += product1
  }
  for (let y = 1; y < coordsUTM.length; y++) {
    const product2 = coordsUTM[y - 1].x * coordsUTM[y].y
    areaY += product2
  }

  const repeatX = coordsUTM[coordsUTM.length - 1].y * coordsUTM[0].x
  const repeatY = coordsUTM[coordsUTM.length - 1].x * coordsUTM[0].y

  areaX += repeatX
  areaY += repeatY

  const D = areaX - areaY
  const areaM2 = 0.5 * D

  return Math.ceil(Math.abs(areaM2))
}
