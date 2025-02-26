# ChatGPT Draft Saver

A simple Chrome extension that automatically saves your drafted text in ChatGPT so you don’t lose your work if you refresh or leave the page.

---

## Features

- **Autosave**: Captures text from ChatGPT’s input (contenteditable) and stores it in `chrome.storage.local`.
- **Restore**: Recovers the last draft whenever you return to a conversation.
- **Clear**: Erases the saved draft when you submit or clear the message.
- **Silent Operation**: Works in the background; all relevant logging is done to the console.

---

## Installation

1. **Download or Clone** this repository to a folder on your machine.
2. **Enable Developer Mode** in Chrome:
   - Go to `chrome://extensions`.
   - Toggle on **Developer Mode** in the top-right corner.
3. **Load the Extension**:
   - Click **Load Unpacked**.
   - Select the folder containing the `manifest.json` file.
4. **Verify**:
   - Navigate to [chat.openai.com](https://chat.openai.com/) or [chatgpt.com](https://chatgpt.com/).
   - Open **DevTools** → **Console**.
   - You should see logs about draft saving/restoring when you type in ChatGPT’s input area.

---

## Usage

1. **Type Your Message**:
   - Begin typing in the ChatGPT input field.
   - The extension will autosave after a short debounce period (1 second by default).
2. **Refresh/Leave & Return**:
   - If you leave or refresh the page, your drafted text will be restored automatically next time you open the same conversation.
3. **Submit a Message**:
   - When you submit your text, the saved draft is cleared.
   - Refreshing afterward starts with an empty input.

---

## Troubleshooting

- **Draft Not Saving**:
  - Check the **Console** for errors or messages.
  - Confirm the domain matches what’s declared in `manifest.json` (`chat.openai.com` or `chatgpt.com`).
  - Make sure the contenteditable selector aligns with the site’s actual HTML structure.
- **Icon Errors**:
  - If Chrome complains about missing icons, either add the icon files at the paths specified or remove the `"icons"` field in `manifest.json`.
- **Permission Issues**:
  - Ensure `"storage"` is listed under `"permissions"` in `manifest.json` if you receive errors about chrome.storage.

---

## License

This extension is provided “as is.” Feel free to customize it for personal use. If you share it, mention the original repository or provide an attribution link.

---

Icon by Freepik - https://www.freepik.com/icon/document_342732#fromView=search&page=1&position=32&uuid=00e0de63-37a1-4a1a-b836-f98634846a5b

Happy drafting!
