let parsedUrl = new URL(window.location.href);
let id = parsedUrl.searchParams.get("id");

document.getElementById("orderId").innerText = id;

localStorage.clear();
