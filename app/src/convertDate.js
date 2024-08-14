export function convertDate(dateString) {
  const dateObject = new Date(dateString);

  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "short",
  };

  return dateObject.toLocaleDateString("en-US", options);
}
