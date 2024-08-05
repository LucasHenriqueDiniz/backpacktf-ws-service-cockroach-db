@ECHO OFF
TITLE Environment Initialization

:: Clear the screen
CLS

:: Create the .env file
ECHO Creating the .env file...
(
    ECHO WEBSOCKET_URL="wss://ws.backpack.tf/events"
    ECHO DATABASE_URL="YOUR_POSTGRES_URL"
    ECHO BPTF_TOKEN="YOUR_BACKPACK.TF_TOKEN"
) > .env

:: Install the dependencies
ECHO.
ECHO Installing dependencies...
npm install

:: Create the Prisma database
ECHO.
ECHO Creating the Prisma database...
npx prisma db push

:: Migrate the database
ECHO.
ECHO Migrating the database...
npx prisma migrate dev

:: Final message
ECHO.
ECHO Setup complete! You can now start the server with 'npm start'.

:: Keep the terminal open
ECHO.
ECHO Press any key to exit...
PAUSE >NUL
