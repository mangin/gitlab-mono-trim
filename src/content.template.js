// Function to process file path using configured patterns
async function processFilePath(filePath) {
  try {
    // Hardcoded pattern from build configuration
    const patterns = [
      { pattern: '{{DEFAULT_PATTERN}}', enabled: true }
    ];
    
    for (const config of patterns) {
      if (!config.enabled) continue;
      
      try {
        const regex = new RegExp(config.pattern);
        if (regex.test(filePath)) {
          return filePath.replace(regex, '');
        }
      } catch (error) {
        console.error(`Invalid regex pattern: ${config.pattern}`, error);
      }
    }
    
    // Return empty path if no pattern matched
    return '';
  } catch (error) {
    console.error('Error processing file path:', error);
    return filePath;
  }
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
async function addCopyButton(fileHeader) {
  // Check if button already exists
  if (fileHeader.querySelector('.gitlab-copy-path-btn')) {
    console.log('Button already exists, skipping:', fileHeader);
    return;
  }
  
  // Mark this header as processed to prevent race conditions
  if (fileHeader.dataset.copyButtonProcessed === 'true') {
    return;
  }
  fileHeader.dataset.copyButtonProcessed = 'true';
  
  console.log('Adding copy button to file header:', fileHeader);

  // Get the file path from .file-title-name
  const fileTitleElement = fileHeader.querySelector('.file-title-name');
  if (!fileTitleElement) {
    return;
  }
  console.log('Found file title element:', fileTitleElement);

  const filePath = fileTitleElement.textContent.trim();
  const processedPath = await processFilePath(filePath);

  // Only add button if there's content to copy
  if (processedPath === '') {
    return;
  }
  console.log('Processed file path:', processedPath);

  // Create the copy button
  const copyButton = document.createElement('button');
  copyButton.className = 'gitlab-copy-path-btn';
  copyButton.title = `Copy: ${processedPath}`;
  
  // Add icon
  const icon = document.createElement('img');
  icon.src = chrome.runtime.getURL('assets/copy.svg');
  icon.alt = 'Copy';
  icon.className = 'copy-icon';
  copyButton.appendChild(icon);

  // Add click handler
  copyButton.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    copyToClipboard(processedPath);
    
    // Visual feedback
    copyButton.classList.add('copied');
    
    setTimeout(() => {
      copyButton.classList.remove('copied');
    }, 2000);
  });
  console.log('added');

  // Insert button into the file header
  fileHeader.appendChild(copyButton);
}

// Function to process all file headers
async function processFileHeaders() {
  const fileHeaders = document.querySelectorAll('.file-header-content');
  console.log('Processing file headers:', fileHeaders.length);
  for (const fileHeader of fileHeaders) {
    await addCopyButton(fileHeader);
  }
}

// Initial processing
processFileHeaders();

// Debounce function to prevent excessive calls
let debounceTimer;
function debounce(func, delay) {
  return function() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(func, delay);
  };
}

// Watch for dynamically added file headers
const observer = new MutationObserver(debounce(() => {
  processFileHeaders();
}, 300)); // Wait 300ms after last change before processing

// Start observing the document for changes
observer.observe(document.body, {
  childList: true,
  subtree: true
});

console.log('GitLab File Path Copy extension loaded');
