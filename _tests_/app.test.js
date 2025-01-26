// app.test.js  

// At the top of your test file
class MockDataTransfer {
    constructor() {
      this.items = [];
      this.files = [];
    }
  }
  
  global.DataTransfer = MockDataTransfer;
  

describe('Basic MD to PDF Converter Tests', () => {
    beforeEach(() => {
        // Set up a basic DOM structure before each test
        document.body.innerHTML = `
            <div class="drop-zone" id="dropZone">
                <input type="file" id="fileInput" accept=".md">
            </div>
            <div id="previewContainer" style="display: none;">
                <p id="fileName"></p>
                <button id="convertBtn">Convert to PDF</button>
            </div>
            <div id="loadingSpinner" style="display: none;"></div>
        `;
    });

    test('should have required DOM elements', () => {
        expect(document.getElementById('dropZone')).toBeTruthy();
        expect(document.getElementById('fileInput')).toBeTruthy();
        expect(document.getElementById('previewContainer')).toBeTruthy();
        expect(document.getElementById('convertBtn')).toBeTruthy();
    });

    test('should accept only markdown files', () => {
        const fileInput = document.getElementById('fileInput');
        expect(fileInput.accept).toBe('.md');
    });

    test('should handle valid markdown file selection', () => {
        const fileInput = document.getElementById('fileInput');
        const previewContainer = document.getElementById('previewContainer');
        const fileName = document.getElementById('fileName');

        // Create a mock markdown file
        const mockFile = new File(['# Hello'], 'test.md', {
            type: 'text/markdown'
        });

        // Simulate file selection
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(mockFile);
        fileInput.files = dataTransfer.files;

        // Trigger change event
        fileInput.dispatchEvent(new Event('change'));

        expect(fileName.textContent).toBe('test.md');
        expect(previewContainer.style.display).not.toBe('none');
    });
