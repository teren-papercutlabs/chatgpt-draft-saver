// Utility function to extract conversation ID from URL
function getConversationId() {
    const match = window.location.pathname.match(/\/c\/([a-zA-Z0-9-]+)/);
    return match ? match[1] : 'default';
}

// Function to get the input element (contenteditable div)
function getInputElement() {
    // Try multiple possible selectors for better compatibility
    return document.querySelector('#prompt-textarea[contenteditable="true"]') ||
           document.querySelector('div[contenteditable="true"][role="textbox"]') ||
           document.querySelector('div[contenteditable="true"]');
}

// Function to get text content from input
function getInputText(element) {
    // Use textContent to get plain text without HTML formatting
    return element?.textContent?.trim() || '';
}

// Function to set text content in input
function setInputText(element, text) {
    if (!element) return;
    
    // Set the text content
    element.textContent = text;
    
    // Place cursor at the end of the text
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(element);
    range.collapse(false); // false means collapse to end
    selection.removeAllRanges();
    selection.addRange(range);
    
    // Trigger both input and change events for better compatibility
    element.dispatchEvent(new Event('input', { bubbles: true }));
    element.dispatchEvent(new Event('change', { bubbles: true }));
    
    // Focus the element
    element.focus();
}

// Function to save draft
async function saveDraft(text) {
    const conversationId = getConversationId();
    const data = {
        text,
        timestamp: Date.now()
    };
    
    try {
        await chrome.storage.local.set({ [conversationId]: data });
        // console.log('Draft saved for conversation:', conversationId);
    } catch (error) {
        // console.error('Error saving draft:', error);
    }
}

// Function to restore draft
async function restoreDraft() {
    const conversationId = getConversationId();
    
    try {
        const result = await chrome.storage.local.get(conversationId);
        const data = result[conversationId];
        
        if (data?.text) {
            const input = getInputElement();
            if (input) {
                setInputText(input, data.text);
                // console.log('Draft restored for conversation:', conversationId);
            }
        }
    } catch (error) {
        // console.error('Error restoring draft:', error);
    }
}

// Function to clear draft
async function clearDraft() {
    const conversationId = getConversationId();
    
    try {
        await chrome.storage.local.remove(conversationId);
        // console.log('Draft cleared for conversation:', conversationId);
    } catch (error) {
        // console.error('Error clearing draft:', error);
    }
}

// Function to initialize input monitoring
function initializeInputMonitoring() {
    let debounceTimer;
    let currentInput = null;
    
    // Monitor DOM for input element (it might load dynamically)
    const observer = new MutationObserver((mutations, obs) => {
        const input = getInputElement();
        if (input && input !== currentInput) {
            currentInput = input;
            
            // Restore any saved draft
            restoreDraft();
            
            // Listen for input changes
            const handleInput = (e) => {
                clearTimeout(debounceTimer);
                debounceTimer = setTimeout(() => {
                    saveDraft(getInputText(e.target));
                }, 1000); // Debounce save operations by 1 second
            };
            
            input.addEventListener('input', handleInput);
            input.addEventListener('keyup', handleInput); // Additional event for better compatibility
            
            // Find the closest form or submit button
            const form
            = input.closest('form');
            const submitButton = document.querySelector('button[type="submit"]') ||
                               document.querySelector('button[data-testid="send-button"]');
            
            // Clear draft when message is sent
            if (form) {
                form.addEventListener('submit', clearDraft);
            }
            if (submitButton) {
                submitButton.addEventListener('click', clearDraft);
            }
        }
    });
    
    // Start observing the DOM
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true
    });
}

// Initialize when the page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeInputMonitoring);
} else {
    initializeInputMonitoring();
} 