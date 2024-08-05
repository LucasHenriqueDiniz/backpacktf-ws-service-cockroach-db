# Backpack.tf WebSocket Service with CockroachDB

<p align="center"><img src="https://socialify.git.ci/LucasHenriqueDiniz/backpacktf-ws-service-cockroach-db/image?description=1&amp;descriptionEditable=&amp;language=1&amp;name=1&amp;owner=1&amp;pattern=Brick%20Wall&amp;theme=Light" alt="project-image"></p>

<p align="center">Create a Node.js application that connects to the Backpack.tf WebSocket service and gathers listing data. It then stores this data in a CockroachDB database ensuring the information remains up-to-date.</p>
 
# Table of Contents

This is a table of contents for your project. It helps the reader navigate through the README quickly.

- [Project Title](#project-title)
- [Table of Contents](#table-of-contents)
- [Installation](#installation)
- [Usage](#usage)
- [Development](#development)
- [Contribute](#contribute)
- [License](#license)

## Features

- Real-time listing updates via Backpack.tf's WebSocket service.
- Secure storage of listings in a CockroachDB database.
- Prioritization of specific items for more frequent price updates (ideal for custom pricers).

## Requirements

- Node.js v16 or later
- Running CockroachDB instance
- Backpack.tf API token

## Installation

1. **Clone the repository:**

   ```bash
   git clone [https://github.com/LucasHenriqueDiniz/backpacktf-ws-service-cockroach-db.git](https://github.com/LucasHenriqueDiniz/backpacktf-ws-service-cockroach-db.git)
   ```

2. **Automated Installation:**

   ```bash
   run initial.bat
   ```

3. **Manual Installation:**

   ```
    npm install
   ```

4. **Environment Variables:**

   Create a `.env` file in the root directory and add the following variables:

   ```
    WEBSOCKET_URL="wss://ws-backpack.tf/ws"
    DATABASE_URL="postgresql://username:password@localhost:26257/database_name?sslmode=disable"
    BPTF_TOKEN="YOUR_BPTF_TOKEN"
   ```

   optional:

   ```
   PRIORITY_ITEMS="item1,item2,item3"
   ```

5. **Initialize Prisma the Database:**

   ```bash
    npx prisma db push
   ```

6. **Migrate the Database:**

   ```bash
    npx prisma migrate dev
   ```

7. **Start the Application:**

   ```
    npm start
   ```

## Usage

1. **Start the Application:**

   ```
    npm start
   ```

2. **View the Database:**
   The database can be accessed using a GUI tool like [DBeaver](https://dbeaver.io/).

## Issues

If you encounter any issues, please open an issue in the issues tab.

## Contribute

Contributions are always welcome! Please create a pull request with your changes.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Important Notes

- This project is not affiliated with Backpack.tf.
- The Backpack.tf WebSocket service is a premium feature and requires a subscription to access.
- This project is under development and may contain bugs.
- Contact me in Discord if you have any questions: `amayacrab`

```

```
