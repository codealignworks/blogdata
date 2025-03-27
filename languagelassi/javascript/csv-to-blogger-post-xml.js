document.addEventListener('DOMContentLoaded', () => {
    const csvInput = document.getElementById('csv-input');
    const outputXml = document.getElementById('output-xml');
    const convertBtn = document.getElementById('convert-btn');
    const fileUpload = document.getElementById('file-upload');

    convertBtn.addEventListener('click', convertCsvToXml);
    fileUpload.addEventListener('change', handleFileUpload);

    function handleFileUpload(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                csvInput.value = e.target.result;
                convertCsvToXml();
            };
            reader.readAsText(file);
        }
    }

    function convertCsvToXml() {
        const csvData = csvInput.value;
        const entries = parseCsv(csvData);
        const xml = buildXml(entries);
        outputXml.value = xml;
    }

    function parseCsv(csvData) {
        const lines = csvData.split('\n');
        const headers = lines[0].match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g).map(header => header.replace(/^"|"$/g, '').trim());
        const entries = [];

        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g);
            if (values && values.length === headers.length) {
                const entry = {};
                for (let j = 0; j < headers.length; j++) {
                    entry[headers[j]] = values[j].replace(/^"|"$/g, '').trim();
                }
                entries.push(entry);
            }
        }
        return entries;
    }

    function buildXml(entries) {
        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<ns0:feed xmlns:ns0="http://www.w3.org/2005/Atom">\n';
        xml += '    <ns0:title type="html">Any Theme</ns0:title>\n';
        xml += '    <ns0:generator>Blogger</ns0:generator>\n';
        xml += '    <ns0:link href="http://www.sneeit.com" rel="self" type="application/atom+xml"/>\n';
        xml += '    <ns0:link href="http://www.sneeit.com" rel="alternate" type="text/html"/>\n';
        xml += '    <ns0:updated>2025-03-22T11:54:52Z</ns0:updated>\n';

        entries.forEach(entry => {
            const categories = entry.Categories.split(',').map(cat => cat.trim().replace(/^"|"$/g, ''));
            xml += '    <ns0:entry>\n';
            categories.forEach(cat => {
                xml += `        <ns0:category scheme="http://www.blogger.com/atom/ns#" term="${cat}"/>\n`;
            });
            xml += '        <ns0:category scheme="http://schemas.google.com/g/2005#kind" term="http://schemas.google.com/blogger/2008/kind#post"/>\n';
            xml += `        <ns0:id>${entry.Id}</ns0:id>\n`;
            xml += '        <ns0:author>\n';
            xml += `            <ns0:name>${entry.Author}</ns0:name>\n`;
            xml += '        </ns0:author>\n';
            xml += `        <ns0:content type="html">${entry.Content}</ns0:content>\n`;
            xml += `        <ns0:published>${entry.Published}</ns0:published>\n`;
            xml += `        <ns0:title type="html">${entry.Title}</ns0:title>\n`;
            xml += `        <ns0:link href="${entry.SelfLink}" rel="self" type="application/atom+xml"/>\n`;
            xml += `        <ns0:link href="${entry.AlternateLink}" rel="alternate" type="text/html"/>\n`;
            xml += '    </ns0:entry>\n';
        });

        xml += '</ns0:feed>';
        return xml;
    }
});