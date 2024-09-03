export const createSlug = (data:string)=> {
  return data
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, '_')
    .replace(/^_+|_+$/g, '');
}
