/** The example .env ships a row of x as placeholder. */
export const isMapboxToken = (token: string): boolean => !!token && !/^x+$/i.test(token)
