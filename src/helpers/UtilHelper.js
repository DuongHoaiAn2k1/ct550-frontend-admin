
function formatCurrency(amount) {
  return amount?.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });
}

function convertTime(dateTimeString) {
  const dateTime = moment(dateTimeString);
  dateTime.utcOffset(7);

  const formattedDateTime = dateTime.format("DD/MM/YYYY HH:mm:ss");
  return formattedDateTime;
}

export { formatCurrency, convertTime };
