import React from 'react';
import { useState } from 'react';
// import "./App.css";

export default function Chat({ fileId }: { fileId: string }) {
  const [question, setQuestion] = useState('');
  const [qaChain, setQaChain] = useState<{ author: string; message: string }[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleQuestionChange = (event: any) => {
    setQuestion(event.target.value);
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    setIsLoading(true);
    const query = question;
    setQuestion('');
    setQaChain((oldQaChain) => [
      ...oldQaChain,
      { author: 'user', message: query },
    ]);

    fetch('http://127.0.0.1:8000/predict', {
      method: 'POST',
      headers: {
        'content-type': 'application/json;charset=UTF-8',
      },
      body: JSON.stringify({
        file_id: fileId,
        query,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setQaChain((oldQaChain) => [
          ...oldQaChain,
          { author: 'chatbot', message: data.result },
        ]);
        setIsLoading(false);
      })
      .catch((error) => {
        alert('Something went wrong. Please try again.');
        console.error('Error', error);
        setIsLoading(false);
      });
  };

  return (
    <div className='appBlock'>
      <div>
        {qaChain.map((m) => {
          return (
            <div key={m.message}>
              <div>{m.author + ':'}</div>
              <div>{m.message}</div>
              <br></br>
            </div>
          );
        })}
      </div>
      <form onSubmit={handleSubmit} className='form'>
        <input
          className='questionInput border-spacing-1'
          id='question'
          type='text'
          value={question}
          onChange={handleQuestionChange}
          placeholder='Ask your question here'
        />
        <button
          className='submitBtn bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full ml-2'
          type='submit'
          disabled={!question}
        >
          <div className={isLoading ? 'animate-spin' : ''}>Send</div>
        </button>
      </form>
    </div>
  );
}
