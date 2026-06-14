import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "resort.db")


def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_db()
    c = conn.cursor()

    c.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    c.execute("""
        CREATE TABLE IF NOT EXISTS rooms (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            room_type TEXT NOT NULL,
            price REAL NOT NULL,
            image TEXT,
            description TEXT,
            available INTEGER DEFAULT 1
        )
    """)

    c.execute("""
        CREATE TABLE IF NOT EXISTS bookings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            room_id INTEGER NOT NULL,
            full_name TEXT,
            phone TEXT,
            check_in TEXT NOT NULL,
            check_out TEXT NOT NULL,
            guests INTEGER DEFAULT 1,
            special_requests TEXT,
            payment_method TEXT DEFAULT 'Cash on Arrival',
            reference_number TEXT,
            status TEXT DEFAULT 'pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id),
            FOREIGN KEY (room_id) REFERENCES rooms(id)
        )
    """)
    # migrate existing bookings table if columns missing
    existing = [row[1] for row in c.execute("PRAGMA table_info(bookings)").fetchall()]
    for col, definition in [
        ("full_name", "TEXT"),
        ("phone", "TEXT"),
        ("special_requests", "TEXT"),
        ("payment_method", "TEXT DEFAULT 'Cash on Arrival'"),
        ("reference_number", "TEXT"),
    ]:
        if col not in existing:
            c.execute(f"ALTER TABLE bookings ADD COLUMN {col} {definition}")

    c.execute("""
        CREATE TABLE IF NOT EXISTS blog (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            category TEXT,
            cover TEXT,
            para TEXT,
            description TEXT,
            date TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    c.execute("""
        CREATE TABLE IF NOT EXISTS contact (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            fname TEXT NOT NULL,
            lname TEXT NOT NULL,
            phone TEXT,
            email TEXT NOT NULL,
            subject TEXT,
            company TEXT,
            message TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    c.execute("""
        CREATE TABLE IF NOT EXISTS gallery (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            img TEXT NOT NULL
        )
    """)

    c.execute("""
        CREATE TABLE IF NOT EXISTS features (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            image TEXT,
            description TEXT,
            side_para TEXT
        )
    """)

    c.execute("""
        CREATE TABLE IF NOT EXISTS event_bookings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            event_type TEXT NOT NULL,
            full_name TEXT NOT NULL,
            phone TEXT NOT NULL,
            email TEXT NOT NULL,
            event_date TEXT NOT NULL,
            guests INTEGER DEFAULT 1,
            duration TEXT,
            special_requests TEXT,
            payment_method TEXT DEFAULT 'Cash on Arrival',
            reference_number TEXT,
            status TEXT DEFAULT 'pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    """)
    # migrate existing event_bookings table if columns missing
    existing_eb = [row[1] for row in c.execute("PRAGMA table_info(event_bookings)").fetchall()]
    for col, definition in [
        ("payment_method", "TEXT DEFAULT 'Cash on Arrival'"),
        ("reference_number", "TEXT"),
    ]:
        if col not in existing_eb:
            c.execute(f"ALTER TABLE event_bookings ADD COLUMN {col} {definition}")

    c.execute("""
        CREATE TABLE IF NOT EXISTS newsletter (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    conn.commit()
    _seed_data(conn)
    conn.close()


def _seed_data(conn):
    c = conn.cursor()

    # Seed rooms if empty
    c.execute("SELECT COUNT(*) FROM rooms")
    if c.fetchone()[0] == 0:
        rooms = [
            ("Deluxe Room", "Deluxe", 3000.0, "images/room3.jpg", "Spacious deluxe room with modern amenities.", 1),
            ("Single Room", "Single", 2500.0, "images/room1.jpg", "Comfortable single room perfect for solo travelers.", 1),
            ("Homely Suite", "Suite", 3500.0, "images/room2.jpg", "Luxurious suite with a homely feel.", 1),
            ("Double Room", "Double Room", 5000.0, "images/room3.jpg", "Elegant double room for couples.", 1),
        ]
        c.executemany("INSERT INTO rooms (name, room_type, price, image, description, available) VALUES (?,?,?,?,?,?)", rooms)

    # Seed blog if empty
    c.execute("SELECT COUNT(*) FROM blog")
    if c.fetchone()[0] == 0:
        blogs = [
            ("The Most Advance Business Plan", "Business", "images/blog4.jpg", "Lorem ipsum dolor sit amet consectetur.", "Lorem ipsum dolor sit amet consectetur adipiscing elit.", "January 01, 2024"),
            ("Beautiful Home Page", "Traveling", "images/photo3.jpg", "Lorem ipsum dolor sit amet consectetur.", "Lorem ipsum dolor sit amet consectetur adipiscing elit.", "January 15, 2021"),
            ("Top Ten Destinations", "Travel", "images/blog1.jpg", "Lorem ipsum dolor sit amet consectetur.", "Lorem ipsum dolor sit amet consectetur adipiscing elit.", "February 10, 2021"),
            ("Top Trending Business", "Business", "images/blog2.jpg", "Lorem ipsum dolor sit amet consectetur.", "Lorem ipsum dolor sit amet consectetur adipiscing elit.", "March 05, 2021"),
            ("Fun Activities", "Adventure", "images/blog3.jpg", "Lorem ipsum dolor sit amet consectetur.", "Lorem ipsum dolor sit amet consectetur adipiscing elit.", "April 20, 2021"),
            ("Resort Life", "Lifestyle", "images/food1.jpg", "Lorem ipsum dolor sit amet consectetur.", "Lorem ipsum dolor sit amet consectetur adipiscing elit.", "May 01, 2021"),
        ]
        c.executemany("INSERT INTO blog (title, category, cover, para, description, date) VALUES (?,?,?,?,?,?)", blogs)

    # Seed gallery if empty
    c.execute("SELECT COUNT(*) FROM gallery")
    if c.fetchone()[0] == 0:
        gallery = [
            ("Gallery One", "images/photo1.jpg"),
            ("Gallery Two", "images/food2.jpg"),
            ("Gallery Three", "images/adventure.jpg"),
            ("Gallery Four", "images/food1.jpg"),
            ("Gallery Five", "images/dining.jpg"),
            ("Gallery Six", "images/photo3.jpg"),
        ]
        c.executemany("INSERT INTO gallery (title, img) VALUES (?,?)", gallery)

    # Seed features if empty
    c.execute("SELECT COUNT(*) FROM features")
    if c.fetchone()[0] == 0:
        features = [
            ("Wedding", "images/wedding.jpg", "We offer premium wedding packages tailored to your dream day.", "Elegant venues with full catering and decoration services."),
            ("Birthday", "images/birthday.jpg", "Celebrate your special day with our customized birthday packages.", "Fun themes, great food, and memorable experiences."),
            ("Seminar", "images/seminar.jpg", "Professional seminar setups with state-of-the-art facilities.", "AV equipment, catering, and dedicated event staff included."),
            ("Theme Party", "images/theme.jpg", "Creative themed parties for all occasions.", "Custom decorations, costumes, and entertainment options."),
            ("Adventure", "images/adventure.jpg", "Thrilling adventure activities for the bold.", "Guided tours, outdoor sports, and nature exploration."),
            ("Dining", "images/dining.jpg", "Fine dining experience with a wide variety of cuisines.", "Local and international dishes prepared by expert chefs."),
        ]
        c.executemany("INSERT INTO features (title, image, description, side_para) VALUES (?,?,?,?)", features)

    conn.commit()
