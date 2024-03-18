# Doc Chatbot

Chat with own documents (Powered by ChatGPT).

## Project structure

In this project, there are 2 directories

1. `backend` containing the server side **python** code
2. `frontend` containing the client side **typescript** code.

### Backend

**Requirements**: Python 3.10 or above.

1. `main.py` which is the entry point to our server
2. This project has a few Python packages as dependencies, you can install them in your virtual environment using `requirements.txt`. If you were to use other dependencies, then please add them to `requirements.txt`.
3. We will be using [`conda`](https://docs.conda.io/projects/conda/en/stable/) package manager to create a virtual environment `chatbot` using `conda create -n chatbot python=3.10` and then `conda activate chatbot` to activate the environment.
4. Then install the python packages using `pip install -r requirements.txt`

#### Running the backend server

To launch the server, navigate to the `backend` directory and run:

##### `uvicorn main:app --reload`

This will start the server at [http://127.0.0.1:8000/](http://127.0.0.1:8000/)

### Frontend

**Requirements**: `node V20.11.1` and `npm 10.2.4`

#### How to launch the react app

1. Navigate to the `frontend` directory and run `npm install`
2. Then you can run:

   ##### `npm start`

   This will launch the app in development mode.\
   Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits. You will also see any lint errors in the console.

## Design Decisions

### Backend

1. Backend has two endpoints: `/upload` for uploading file and `/predict` for answering the questions.
2. The `/upload` endpoint accepts only `.pdf`, `.docx`, `.txt` and `.csv` files.

### Frontend

1. The homepage asks only for a file.
2. Once the file is uploaded, a chat interface is displayed to answer queries.
