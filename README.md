# URL Shortener

A simple college-level full-stack URL shortener. Enter a long URL and the application generates a short link that redirects to the original address.

## Technologies used

- HTML, CSS, Vanilla JavaScript
- Node.js and Express.js
- MongoDB with Mongoose
- `dotenv` for environment variables

## Features

- Validates submitted URLs
- Creates a unique short code and saves it in MongoDB
- Redirects short links to the original URL
- Copy button for the generated link
- Basic success and error messages
- Responsive, minimal interface
- Handles missing short codes and duplicate-code collisions

## Requirements

- Node.js (LTS recommended)
- npm
- MongoDB running locally, or a MongoDB Atlas connection string

## Installation

1. Extract the project folder and open it in a terminal.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the project root. You can copy `.env.example` and rename the copy to `.env`.

4. Configure the environment variables:

   ```env
   MONGODB_URI=mongodb://127.0.0.1:27017/url_shortener
   PORT=3000
   ```

   The example URI works when MongoDB is installed and running on your computer. For MongoDB Atlas, replace it with your Atlas connection string. Keep `.env` private and do not commit it.

5. Start the application:

   ```bash
   npm start
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

The server connects to MongoDB before it starts listening. If the database connection fails, check that MongoDB is running and that `MONGODB_URI` is correct.

## API endpoints

### `POST /api/shorten`

Creates a short URL.

Request body:

```json
{
  "originalUrl": "https://www.example.com/a/very/long/page"
}
```

Example successful response (`201 Created`):

```json
{
  "originalUrl": "https://www.example.com/a/very/long/page",
  "shortCode": "AbCd123",
  "shortUrl": "http://localhost:3000/AbCd123"
}
```

The code and URL in this example are illustrative; actual generated values will differ.

Possible errors include `400` for a missing or invalid URL and `500` if the URL cannot be saved.

### `GET /:shortCode`

Looks up a short code and redirects to the original URL. If no matching code exists, the server returns a simple `404` page.

Example: opening `http://localhost:3000/AbCd123` redirects to the original URL if that code exists.

## Example usage

1. Start MongoDB and the Node.js server.
2. Visit `http://localhost:3000`.
3. Paste a full URL, such as `https://www.example.com/some/long/path`.
4. Click **Shorten URL**.
5. Click the displayed short link to test the redirect, or click **Copy** to copy it.

## Project structure

```text
url-shortener/
├── server.js
├── package.json
├── .env.example
├── .gitignore
├── models/
│   └── Url.js
├── routes/
│   └── urlRoutes.js
├── public/
│   ├── index.html
│   ├── style.css
│   └── script.js
└── README.md
```

## Notes

- The application generates random short codes and relies on a unique MongoDB index to prevent duplicate codes.
- The actual `.env` file is intentionally not included. Create it locally using the steps above.
- Do not share your MongoDB credentials or commit `.env` to version control.
