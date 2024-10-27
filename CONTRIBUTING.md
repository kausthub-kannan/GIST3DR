# Contributing

We welcome contributions to this project. Please read the following for more information.

## Getting Started
1. Fork the repository.
2. Clone the repository to your local machine.
3. Install the dependencies for the server and client.
4. Running the server:
Install the required dependencies for the server by running the following command:
```bash
cd server
poetry install
```
To run the server, run the following command:
```bash
cd server
uvicorn main:app --reload
```

5. To run the client or NextJS, run the following command:
```bash
cd client
npm run dev
```

### Contributing ro the Server
To contribute to the server, please follow the following steps:
1. Follow standard Restful API conventions.
2. For keeping a uniform codebase, please `black` and `ruff` your code before pushing.

### Contributing to the Client
To contribute to the client, please follow the following steps:
1. Follow the standard NextJS conventions.
2. For keeping a uniform codebase, please `prettier` your code before pushing.
