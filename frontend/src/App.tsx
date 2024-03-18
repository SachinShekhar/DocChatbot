import { useState } from 'react';
import Chat from './Chat';
// import "./App.css";

export default function App() {
  const [file, setFile] = useState();
  const [fileId, setFileId] = useState();
  const [filename, setFilename] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const onReset = () => {
    setFileId(undefined);
  };

  const handleFileChange = (event: any) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData();

    if (file) {
      formData.append('file', file);
    }

    fetch('https://doc-chatbot-5k7t35rzkq-uc.a.run.app/upload', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        setIsLoading(false);
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
        setIsLoading(false);
        console.error('Error', error);
      });
  };

  return (
    <div className='pl-4 pt-4'>
      <div className='text-2xl font-bold'>Doc Chatbot</div>
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
            <button
              className='submitBtn bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mt-4'
              type='submit'
              disabled={!file}
            >
              <div className={isLoading ? 'animate-spin' : ''}>Start Chat</div>
            </button>
          </form>
        </div>
      )}
      {fileId && (
        <div>
          <div className='flex flex-row gap-4'>
            <div>Chat with {filename}</div>
            <button
              className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full'
              onClick={onReset}
            >
              Reset
            </button>
          </div>
          <Chat fileId={fileId} />
        </div>
      )}
    </div>
  );
}
