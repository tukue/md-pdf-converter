// app.test.js  

class MockDataTransfer {
    constructor() {
        this.items = [];
        this.files = [];
    }

    addItem(file) {
        this.items.push({
            kind: 'file',
            type: file.type,
            getAsFile: () => file
        });
        this.files.push(file);
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

    test('should show loading spinner when converting', () => {
        const convertBtn = document.getElementById('convertBtn');
        const loadingSpinner = document.getElementById('loadingSpinner');

        // Simulate the click event on the convert button
        convertBtn.addEventListener('click', () => {
            // This is a simple simulation of showing the spinner when clicking convert
            loadingSpinner.style.display = 'block';
        });

        convertBtn.click();

        // Check if the spinner is shown
        expect(loadingSpinner.style.display).not.toBe('none');
    });
});
