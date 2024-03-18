import { useState } from 'react';
import Chat from './Chat';
// import "./App.css";

export default function App() {
  const [file, setFile] = useState();
  const [fileId, setFileId] = useState();
  const [filename, setFilename] = useState('');

  const onReset = () => {
    setFileId(undefined);
  };

  const handleFileChange = (event: any) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();

    const formData = new FormData();

    if (file) {
      formData.append('file', file);
    }

    fetch('http://127.0.0.1:8000/upload', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.file_id === 'File type not supported') {
          alert('File type not supported');
          return;
        } else if (data.file_id === 'error') {
          alert('Something went wrong. Please try again.');
          return;
        } else {
          setFileId(data.file_id);
          setFilename(data.filename);
        }
      })
      .catch((error) => {
        console.error('Error', error);
      });
  };

  return (
    <div className='pl-4 pt-4'>
      <div className='text-lg font-bold'>Doc Chatbot</div>
      {!fileId && (
        <div className='appBlock'>
          <form onSubmit={handleSubmit} className='form'>
            <label className='fileLabel' htmlFor='file'>
              Upload PDF, DocX, TXT or CSV file:
            </label>
            <br></br>
            <input
              type='file'
              id='file'
              name='file'
              onChange={handleFileChange}
              className='fileInput'
            />
            <br></br>
            <button className='submitBtn' type='submit' disabled={!file}>
              Start Chat
            </button>
          </form>
        </div>
      )}
      {fileId && (
        <div>
          <button onClick={onReset}>Reset</button>
          <Chat fileId={fileId} filename={filename} />
        </div>
      )}
    </div>
  );
}
