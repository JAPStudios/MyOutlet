// content.js

// Log a message when the content script is loaded
console.log("MyOutlet loaded");

// Apply custom styles and modifications
function applyCustomization() {
  // Replace logo
  const logoElement = document.querySelector(".logo-selector");
  if (logoElement) {
    logoElement.src = chrome.runtime.getURL("MO.svg");
  }

  // Change name and typography
  const nameElements = document.querySelectorAll(".name-selector");
  nameElements.forEach(element => {
    element.textContent = "MyOutlet";
    element.style.fontFamily = "Arial, sans-serif";
  });

  // Make first two characters of each word bold
  const textElements = document.querySelectorAll(".text-selector");
  textElements.forEach(element => {
    const words = element.textContent.split(" ");
    const modifiedWords = words.map(word => {
      if (word.length >= 2) {
        return `<strong>${word.substring(0, 2)}</strong>${word.substring(2)}`;
      }
      return word;
    });
    element.innerHTML = modifiedWords.join(" ");
  });
}

// Function to retrieve the YouTube dislike count
function getDislikeCount() {
  const dislikeElement = document.querySelector(".dislike-button .yt-formatted-string");
  if (dislikeElement) {
    return dislikeElement.textContent;
  }
  return "Dislike count not found";
}

// Send a message to the background script to inject the dislike functionality
chrome.runtime.sendMessage({ action: "injectDislikeScript" });

// Wait for the page to fully load before applying modifications
window.addEventListener("load", applyCustomization);

// Log success message to the console
console.log("Message sent to inject dislike script.");