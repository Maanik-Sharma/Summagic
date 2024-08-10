const textArea = document.getElementById("text_to_summarize");
const submitButton = document.getElementById("submit-button");
const summarizedTextArea = document.getElementById("summary");
submitButton.disabled = true;
textArea.addEventListener("input", verifyTextLength);
submitButton.addEventListener("click", submitData);

function verifyTextLength(e) {
  // The e.target property gives us the HTML element that triggered the event, which in this case is the textarea. We save this to a variable called 'textarea'
  const textarea = e.target;
  // Verify the TextArea value.
  if (textarea.value.length > 200 && textarea.value.length < 100000) {
    // Enable the button when text area has value.
    submitButton.disabled = false;
  } else {
    // Disable the button when text area is empty.
    submitButton.disabled = true;
  }
}

function submitData(e) {
  // This is used to add animation to the submit button
  submitButton.classList.add("submit-button--loading");
  const text_to_summarize = textArea.value;
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  var raw = JSON.stringify({
    "text_to_summarize": text_to_summarize
  });
  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };
  // Send the text to the server using fetch API
  // Note - here we can omit the "baseUrl" we needed in Postman and just use a relative path to "/summarize" because we will be calling the API from our Replit!  
  fetch('/summarize', requestOptions)
    .then(response => response.text()) // Response will be summarized text
    .then(summary => {
      // Do something with the summary response from the back end API!
      // Update the output text area with new summary
      summarizedTextArea.value = summary;
      // Stop the spinning loading animation
      submitButton.classList.remove("submit-button--loading");
    })
    .catch(error => {
      console.log(error.message);
    });
}

// Function to handle file upload
function handleFileUpload(e) {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      textArea.value = e.target.result;
      verifyTextLength({ target: textArea }); // Trigger length verification
    };
    reader.readAsText(file);
  }
}

// Function to handle copying of summarized text

// function handleCopyText() {
//   const summarizedTextArea = document.getElementById('summary');
//   summarizedTextArea.select();
//   document.execCommand('copy');
//   alert('Summarized text copied to clipboard!');
// }

function handleCopyText() {
  const summarizedTextArea = document.getElementById('summary');
  const textToCopy = summarizedTextArea.value;

  navigator.clipboard.writeText(textToCopy).then(() => {
    // alert('Summarized text copied to clipboard!');
  }).catch(err => {
    console.error('Failed to copy text: ', err);
  });
}

// Add event listeners when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  const fileInput = document.getElementById('fileInput');
  const uploadButton = document.getElementById('uploadButton');
  const copyButton = document.getElementById('copyButton');

  if (fileInput) {
    fileInput.addEventListener('change', handleFileUpload);
  }

  if (uploadButton) {
    uploadButton.addEventListener('click', () => {
      fileInput.click();
    });
  }

  if (copyButton) {
    copyButton.addEventListener('click', handleCopyText);
  }
});

// Keep the existing event listeners
document.getElementById('submit-button').addEventListener('click', submitData);