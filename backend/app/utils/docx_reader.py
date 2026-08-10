import zipfile
import xml.etree.ElementTree as ET
from fastapi import UploadFile
import io

def extract_text_from_docx(file: UploadFile) -> str:
    """Extracts text from a DOCX file using built-in libraries."""
    file_bytes = file.file.read()
    
    try:
        with zipfile.ZipFile(io.BytesIO(file_bytes)) as docx:
            xml_content = docx.read('word/document.xml')
            
        tree = ET.XML(xml_content)
        
        # The namespace for Word XML
        WORD_NAMESPACE = '{http://schemas.openxmlformats.org/wordprocessingml/2006/main}'
        PARA = WORD_NAMESPACE + 'p'
        TEXT = WORD_NAMESPACE + 't'
        
        paragraphs = []
        for paragraph in tree.iter(PARA):
            texts = [node.text for node in paragraph.iter(TEXT) if node.text]
            if texts:
                paragraphs.append(''.join(texts))
                
        return '\n'.join(paragraphs)
    except Exception as e:
        print(f"Error reading docx: {e}", flush=True)
        return ""
