# WordPress to Ghost 2.x migration tool

This project scrapes a WordPress MySQL installation, and generates a `ghost.json` file
that can be imported into Ghost 2 installations.

First, clone the repository:
```
git clone https://github.com/JVMartin/wordpress-to-ghost.git
```

Next, copy the .env example file:
```
cp .env.example .env
```

Edit the .env file to point it at your MySQL WordPress database.

Install dependencies:
```
npm install
```

Run the script:
```
npm run dev
```

The script may take a long time to run and consume a lot of memory, as it pulls
all posts/users in at the same time.

At the end, a `ghost.json` file will be written into this directory.
