export function formatDate(date) {
  const newDate = new Date(date);

  return new Intl.DateTimeFormat("pt-BR").format(newDate);
}

export function formatHour(hour, shouldAddONeDay = false) {
  const newDate = new Date(hour);

  if (shouldAddONeDay) newDate.setDate(newDate.getDate() + 1);

  return new Intl.DateTimeFormat("pt-BR", {
    // dateStyle: "",
    timeStyle: "medium",
  }).format(newDate);
}

// var date = new Date("2013-03-10T02:00:00Z");
// var date = new Date("2021-11-21T23:37:15.997Z");
// console.log(date.toISOString().substring(0, 10));
// console.log("2021-11-21T23:37:15.997Z".substring(0, 10))
// console.log((new Date() - date)/86400000);
// console.log(new Intl.DateTimeFormat('pt-BR').format(date))
