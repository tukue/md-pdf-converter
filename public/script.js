document.addEventListener('DOMContentLoaded', () => {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const previewContainer = document.getElementById('previewContainer');
    const fileName = document.getElementById('fileName');
    const convertBtn = document.getElementById('convertBtn');
    const loadingSpinner = document.getElementById('loadingSpinner');

    // Prevent default drag behaviors
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
        document.body.addEventListener(eventName, preventDefaults, false);
    });

    // Highlight drop zone when dragging file over it
    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, unhighlight, false);
    });

    // Handle dropped files
    dropZone.addEventListener('drop', handleDrop, false);
    
    // Handle clicked files
    fileInput.addEventListener('change', handleFiles, false);
    
    // Handle click on drop zone
    dropZone.addEventListener('click', () => fileInput.click());
    
    // Handle convert button click
    convertBtn.addEventListener('click', convertToPDF);

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    function highlight(e) {
        dropZone.classList.add('drop-zone--over');
    }

    function unhighlight(e) {
        dropZone.classList.remove('drop-zone--over');
    }

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles({ target: { files } });
    }

    function handleFiles(e) {
        const file = e.target.files[0];
        if (file && (file.name.endsWith('.md') || file.name.endsWith('.doc') || file.name.endsWith('.docx'))) {
            fileName.textContent = file.name;
            previewContainer.style.display = 'block';
        } else {
            alert('Please upload a markdown (.md) or Word (.doc, .docx) file');
        }
    }

    async function convertToPDF() {
        const file = fileInput.files[0];
        if (!file) {
            alert('Please select a file first');
            return;
        }

        const formData = new FormData();
        formData.append('document', file);

        loadingSpinner.style.display = 'block';
        convertBtn.disabled = true;

        try {
            const response = await fetch('/api/convert', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Conversion failed');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = file.name.replace(/\.(md|doc|docx)$/, '.pdf');
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            a.remove();
        } catch (error) {
            alert('Error converting file: ' + error.message);
        } finally {
            loadingSpinner.style.display = 'none';
            convertBtn.disabled = false;
        }
    }
});