const form = document.getElementById("shorten-form");
const urlInput = document.getElementById("long-url");
const shortenButton = document.getElementById("shorten-button");
const message = document.getElementById("message");
const result = document.getElementById("result");
const shortUrlLink = document.getElementById("short-url");
const copyButton = document.getElementById("copy-button");

function showMessage(text, type = "") {
  message.textContent = text;
  message.className = `message ${type}`.trim();
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const originalUrl = urlInput.value.trim();
  result.classList.add("hidden");
  showMessage("");

  if (!originalUrl) {
    showMessage("Please enter a URL.", "error");
    return;
  }

  shortenButton.disabled = true;
  shortenButton.textContent = "Shortening...";

  try {
    const response = await fetch("/api/shorten", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ originalUrl })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Unable to shorten this URL.");
    }

    shortUrlLink.href = data.shortUrl;
    shortUrlLink.textContent = data.shortUrl;
    result.classList.remove("hidden");
    showMessage("Your short link is ready!", "success");
  } catch (error) {
    showMessage(
      error.message || "Could not connect to the server. Please try again.",
      "error"
    );
  } finally {
    shortenButton.disabled = false;
    shortenButton.textContent = "Shorten URL";
  }
});

copyButton.addEventListener("click", async () => {
  const shortUrl = shortUrlLink.href;

  if (!shortUrl || shortUrl === window.location.href + "#") {
    showMessage("Create a short URL first.", "error");
    return;
  }

  try {
    await navigator.clipboard.writeText(shortUrl);
    showMessage("Short URL copied to clipboard!", "success");
  } catch {
    // Fallback for browsers where Clipboard API is unavailable.
    const temporaryInput = document.createElement("textarea");
    temporaryInput.value = shortUrl;
    document.body.appendChild(temporaryInput);
    temporaryInput.select();

    const copied = document.execCommand("copy");
    temporaryInput.remove();

    showMessage(
      copied ? "Short URL copied to clipboard!" : "Copy failed. Please copy the link manually.",
      copied ? "success" : "error"
    );
  }
});
