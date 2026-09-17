async function main() {
  const url = "https://docs.google.com/spreadsheets/d/1BU0fIDP656Y-eue55bWVSxeaixSeFJwR3GP1n8kwBYc/export?format=csv&gid=2110946595";
  console.log("Fetching gid 2110946595...");
  const res = await fetch(url);
  const text = await res.text();
  console.log("=== CSV PREVIEW ===");
  console.log(text.slice(0, 1000));
}
main();
