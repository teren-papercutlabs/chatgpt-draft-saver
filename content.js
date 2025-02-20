// Utility function to extract conversation ID from URL
function getConversationId() {
    const match = window.location.pathname.match(/\/c\/([a-zA-Z0-9-]+)/);
    return match ? match[1] : 'default';
}

// Function to get the input textarea element
function getInputElement() {
    // ChatGPT uses a textarea with role="textbox"
    return document.querySelector('textarea[role="textbox"]');
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
        console.log('Draft saved for conversation:', conversationId);
    } catch (error) {
        console.error('Error saving draft:', error);
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
                input.value = data.text;
                // Trigger input event to ensure ChatGPT's UI updates
                input.dispatchEvent(new Event('input', { bubbles: true }));
                console.log('Draft restored for conversation:', conversationId);
            }
        }
    } catch (error) {
        console.error('Error restoring draft:', error);
    }
}

// Function to clear draft
async function clearDraft() {
    const conversationId = getConversationId();
    
    try {
        await chrome.storage.local.remove(conversationId);
        console.log('Draft cleared for conversation:', conversationId);
    } catch (error) {
        console.error('Error clearing draft:', error);
    }
}

// Function to initialize input monitoring
function initializeInputMonitoring() {
    let debounceTimer;
    
    // Monitor DOM for input element (it might load dynamically)
    const observer = new MutationObserver((mutations, obs) => {
        const input = getInputElement();
        if (input) {
            obs.disconnect(); // Stop observing once we find the input
            
            // Restore any saved draft
            restoreDraft();
            
            // Listen for input changes
            input.addEventListener('input', (e) => {
                clearTimeout(debounceTimer);
                debounceTimer = setTimeout(() => {
                    saveDraft(e.target.value);
                }, 1000); // Debounce save operations by 1 second
            });
            
            // Clear draft when message is sent
            input.closest('form')?.addEventListener('submit', () => {
                clearDraft();
            });
        }
    });
    
    // Start observing the DOM
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

// Initialize when the page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeInputMonitoring);
} else {
    initializeInputMonitoring();
} 