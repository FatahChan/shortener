# URL Shortener Service

## Description

This project is a URL shortener service built with Deno and Hono. It allows users to shorten URLs, retrieve original URLs, view statistics, and manage their shortened links through a RESTful API.

## Prerequisites

Before running this project, ensure that you have [Deno](https://deno.land/) installed on your machine. You can follow the installation instructions from the official Deno documentation [here](https://docs.deno.com/runtime/getting_started/installation/).

## Features

- Shorten long URLs
- Retrieve original URLs using short codes
- View access statistics for shortened URLs
- Update and delete shortened URLs

## Installation

To install and run this project, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/url-shortener.git
   ```
2. Navigate to the project directory:
   ```bash
   cd shortener
   ```
3. Install the necessary dependencies and run the server:
   ```bash
   deno task start
   ```

## API Endpoints

### Shorten a URL

- **POST** `/api/shorten`
  - Request Body: `{ "url": "https://example.com" }`
  - Response: Shortened URL object

### Retrieve a Shortened URL

- **GET** `/api/shorten/:shortCode`
  - Response: Original URL object

### Retrieve Statistics for a Shortened URL

- **GET** `/api/shorten/:shortCode/stats`
  - Response: URL statistics object

### Update a Shortened URL

- **PUT** `/api/shorten/:shortCode`
  - Request Body: `{ "url": "https://new-url.com" }`
  - Response: Updated URL object

### Delete a Shortened URL

- **DELETE** `/api/shorten/:shortCode`
  - Response: Confirmation of deletion

### Redirect to Original URL

- **GET** `/:shortCode`
  - Response: Redirects to the original URL

## Usage

To use the API, you can send requests using tools like Postman or cURL. For example, to shorten a URL, you can use the following cURL command:

```bash
curl -X POST http://localhost:8000/api/shorten -H "Content-Type: application/json" -d '{"url": "https://example.com"}'
```

## Contributing

Contributions are welcome! Please follow these steps to contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes and commit them (`git commit -m 'Add new feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Open a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Hono](https://hono.dev) for the web framework
- [Zod](https://zod.dev) for schema validation
- [Deno](https://deno.land) for the runtime environment
- [URL Shortening Service Project](https://roadmap.sh/projects/url-shortening-service) for additional resources and guidance
