function print(message: string, type: string = "info", showTime: boolean = true) {
  const currentTime = new Date().toTimeString().split(" ")[0];
  // print color based on type
  let colorTime = "\x1b[37m";
  let color = "";
  switch (type) {
    case "success":
      color = "\x1b[32m";
      break;
    case "info":
      color = "\x1b[32m";
      break;
    case "error":
      color = "\x1b[31m";
      break;
    case "warning":
      color = "\x1b[33m";
      break;
    default:
      color = "\x1b[37m";
  }
  console.log(
    `${
      showTime ? colorTime + currentTime + " " : ""
    }${color}[${type.toUpperCase()}] ${message}\x1b[0m`
  );
}

export default print;
