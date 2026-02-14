// Function to process file path
function processFilePath(filePath) {
  // Remove "service/x/" prefix if it exists at the beginning
  if (filePath.startsWith('services/x/')) {
    return filePath.replace(/^services\/x\//, '');
  }
  return '';
}

// Function to copy text to clipboard
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    console.log('Copied to clipboard:', text);
  }).catch(err => {
    console.error('Failed to copy:', err);
  });
}

// Function to create and add copy button
function addCopyButton(fileHeader) {
  // Check if button already exists
  console.log('Checking file header for copy button:', fileHeader);
  if (fileHeader.querySelector('.gitlab-copy-path-btn')) {
    return;
  }
  console.log('Adding copy button to file header:', fileHeader);

  // Get the file path from .file-title-name
  const fileTitleElement = fileHeader.querySelector('.file-title-name');
  if (!fileTitleElement) {
    return;
  }
  console.log('Found file title element:', fileTitleElement);

  const filePath = fileTitleElement.textContent.trim();
  const processedPath = processFilePath(filePath);

  // Only add button if there's content to copy
  if (processedPath === '') {
    return;
  }
  console.log('Processed file path:', processedPath);

  // Create the copy button
  const copyButton = document.createElement('button');
  copyButton.className = 'gitlab-copy-path-btn';
  copyButton.textContent = 'Copy Path';
  copyButton.title = `Copy: ${processedPath}`;

  // Add click handler
  copyButton.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    copyToClipboard(processedPath);
    
    // Visual feedback
    const originalText = copyButton.textContent;
    copyButton.textContent = 'Copied!';
    copyButton.classList.add('copied');
    
    setTimeout(() => {
      copyButton.textContent = originalText;
      copyButton.classList.remove('copied');
    }, 2000);
  });
  console.log('added');

  // Insert button into the file header
  fileHeader.appendChild(copyButton);
}

// Function to process all file headers
function processFileHeaders() {
  const fileHeaders = document.querySelectorAll('.file-header-content');
  console.log('Processing file headers:', fileHeaders.length);
  fileHeaders.forEach(fileHeader => {
    addCopyButton(fileHeader);
  });
}

// Initial processing
processFileHeaders();

// Watch for dynamically added file headers
const observer = new MutationObserver((mutations) => {
  processFileHeaders();
});

// Start observing the document for changes
observer.observe(document.body, {
  childList: true,
  subtree: true
});

console.log('GitLab File Path Copy extension loaded');
