// background.js
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.injectDislikeScript) {
    chrome.scripting.executeScript({
      target: { tabId: sender.tab.id },
      function: injectDislikeScript
    });
  }
});
function injectDislikeScript() {
  // Change background color
  document.body.style.backgroundColor = "#0F0F0F";
  // Change text color
  document.body.style.color = "#FFFFFF";
  // Apply Comic Sans MS font
  document.body.style.fontFamily = "Comic Sans MS, cursive, sans-serif";
  // Make first two characters of every word bold
  const textElements = document.querySelectorAll("*");
  textElements.forEach(element => {
    element.innerHTML = element.innerHTML.replace(/\b(\w{2})/g, '<strong>$1</strong>');
  });
  // Replace logo
  const logoElement = document.querySelector(".logo-selector");
  if (logoElement) {
    logoElement.src = chrome.runtime.getURL("MO.jpg");
  }
  // Replace title
  document.title = "MyOutlet";
  // Restore dislike functionality (you need to implement this part)
  function handleDislikeClick(event) {
    const dislikeButton = event.target;
    const contentId = dislikeButton.getAttribute("data-content-id"); // Replace with actual attribute name
    fetch("https://api.example.com/dislikes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Include any required authentication headers
      },
      body: JSON.stringify({ contentId: contentId }) // Replace with actual payload
    })
    .then(response => {
      if (response.ok) {
        // Dislike registered successfully, update UI as needed
      } else {
        // Handle error scenario
      }
    })
    .catch(error => {
      // Handle network or other errors
    });
  }  
}