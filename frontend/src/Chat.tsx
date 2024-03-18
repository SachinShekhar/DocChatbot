import React from 'react';
import { useState } from 'react';
// import "./App.css";

export default function Chat({
  fileId,
  filename,
}: {
  fileId: string;
  filename: string;
}) {
  const [result, setResult] = useState();
  const [question, setQuestion] = useState();

  const handleQuestionChange = (event: any) => {
    setQuestion(event.target.value);
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();

    const formData = new FormData();
    if (question) {
      formData.append('question', question);
    }

    fetch('http://127.0.0.1:8000/predict', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        setResult(data.result);
      })
      .catch((error) => {
        console.error('Error', error);
      });
  };

  return (
    <div className='appBlock'>
      <div>Chat with {filename}</div>
      <form onSubmit={handleSubmit} className='form'>
        <label className='questionLabel' htmlFor='question'>
          Question:
        </label>
        <input
          className='questionInput'
          id='question'
          type='text'
          value={question}
          onChange={handleQuestionChange}
          placeholder='Ask your question here'
        />
        <br></br>
        <button className='submitBtn' type='submit' disabled={!question}>
          Submit
        </button>
      </form>
      <p className='resultOutput'>Result: {result}</p>
    </div>
  );
}
