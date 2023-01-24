export function invert(date){
  const first = date.slice(0,2);
  const second = date.slice(3,5);
  const rest = date.slice(5);

  return second + '/' + first + rest;
}