from dotenv import load_dotenv
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Any
from uuid import uuid4
from PyPDF2 import PdfReader
from langchain_community.vectorstores import FAISS
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.chains.question_answering import load_qa_chain
from langchain_community.llms import OpenAI
import docx2txt

# Load environment variables from .env file (if any)
load_dotenv()

class UploadResponse(BaseModel):
    file_id: str

class PredictRequest(BaseModel):
    file_id: str
    query: str

class PredictResponse(BaseModel):
    result: str | None

origins = [
    "http://localhost",
    "http://localhost:8080",
    "http://localhost:3000"
]

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/upload", response_model = UploadResponse)
def upload(file: UploadFile = File(...)) -> Any:
    try:
        contents = file.file.read()
        id = str(uuid4())
        file_ext = file.filename.split('.')[-1]
        if file_ext in ['pdf', 'txt', 'docx', 'csv']:
            new_file = f"{id}.{file_ext}"
            with open(new_file, "wb") as f:
                f.write(contents)
            return {"file_id": new_file}
        else:
            return {"file_id": 'File type not supported'}
    except Exception as e:
        print(e)
        return {"file_id": 'error'}
    finally:
        file.file.close()

@app.post("/predict", response_model = PredictResponse)
def predict(body: PredictRequest) -> Any:
    text = ''
    file_ext = body.file_id.split('.')[-1]
    if file_ext == 'pdf':
        pdf_reader = PdfReader(body.file_id)
        for i, page in enumerate(pdf_reader.pages):
            text += page.extract_text()
    elif file_ext in ['txt', 'csv']:
        with open(body.file_id, 'r') as f:
            text = f.read()
    elif file_ext == 'docx':
        text = docx2txt.process(body.file_id)
    text_splitter = RecursiveCharacterTextSplitter(chunk_size = 512, chunk_overlap  = 32, length_function = len)
    texts = text_splitter.split_text(text)
    embeddings = OpenAIEmbeddings()
    docsearch = FAISS.from_texts(texts, embeddings)
    chain = load_qa_chain(OpenAI(), chain_type="stuff")
    docs = docsearch.similarity_search(body.query)
    result = chain.run(input_documents=docs, question=body.query)
    return {"result": result}