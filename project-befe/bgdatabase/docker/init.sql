-- สร้างตาราง books
-- CREATE TABLE books (
-- 	id SERIAL PRIMARY KEY,
-- 	title VARCHAR(255) NOT NULL,
-- 	author VARCHAR(255),
-- 	isbn VARCHAR(50),
-- 	year INTEGER,
-- 	price DECIMAL(10,2),
-- 	created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
-- 	updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
-- );

-- -- สร้าง function สำหรับอัพเดท updated_at โดยอัตโนมัติ
-- CREATE OR REPLACE FUNCTION update_modified_column()
-- RETURNS TRIGGER AS $$
-- BEGIN
--     NEW.updated_at = now();
--     RETURN NEW;
-- END;
-- $$ language 'plpgsql';

-- -- สร้าง trigger เพื่อเรียกใช้ function update_modified_column
-- CREATE TRIGGER update_books_modtime
-- BEFORE UPDATE ON books
-- FOR EACH ROW
-- EXECUTE FUNCTION update_modified_column();

-- -- สร้าง index บน title เพื่อเพิ่มประสิทธิภาพการค้นหา
-- CREATE INDEX idx_books_title ON books(title);

-- -- เพิ่มข้อมูลตัวอย่าง
-- INSERT INTO books (title, author, isbn, year, price) VALUES
--     ('Fundamental of Deep Learning in Practice', 'Nuttachot Promrit and Sajjaporn Waijanya', '978-1234567890', 2023, 599.00),
--     ('Practical DevOps and Cloud Engineering', 'Nuttachot Promrit', '978-0987654321', 2024, 500.00),
--     ('Mastering Golang for E-commerce Back End Development', 'Nuttachot Promrit', '978-1111222233', 2023, 450.00);


-- สร้างตาราง board_games
CREATE TABLE board_games (
     id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    creater VARCHAR(255),                -- คนออกแบบเกม
    publisher VARCHAR(255),               -- ค่ายผู้ผลิต
    category VARCHAR(50),                -- หมวดหมู่เกม เช่น Strategy / Party
    year INTEGER,                        -- ปีที่ออก
    description TEXT,                   -- รายละเอียดเกม
    price NUMERIC(10,2),                  -- ราคาขายจริง
    original_price DECIMAL(10,2),         -- ราคาปกติ
    discount INTEGER DEFAULT 0,         -- ส่วนลด 
    stock INTEGER DEFAULT 0,              -- จำนวนคงเหลือ
    rating DECIMAL(3,2) DEFAULT 0.0,      -- คะแนนเฉลี่ย
    reviews_count INTEGER DEFAULT 0,      -- จำนวนรีวิว
    is_new BOOLEAN DEFAULT false,         -- เป็นของใหม่หรือไม่
    min_players INTEGER,                  -- ผู้เล่นขั้นต่ำ
    max_players INTEGER,                  -- ผู้เล่นสูงสุด
    language VARCHAR(50),                 -- ภาษา
    cover_image VARCHAR(500),             -- รูปภาพ
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ฟังก์ชันอัปเดตค่า updated_at อัตโนมัติเมื่อมีการแก้ไขข้อมูล
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

-- Trigger เรียกฟังก์ชันทุกครั้งที่มีการ UPDATE
CREATE TRIGGER update_board_games_modtime
BEFORE UPDATE ON board_games
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

-- สร้าง Index เพื่อเพิ่มประสิทธิภาพการค้นหาและเรียงลำดับ
CREATE INDEX idx_board_games_title ON board_games(title);
CREATE INDEX idx_board_games_category ON board_games(category);
CREATE INDEX idx_board_games_rating ON board_games(rating DESC);
CREATE INDEX idx_board_games_discount ON board_games(discount DESC) WHERE discount > 0;
CREATE INDEX idx_board_games_is_new ON board_games(is_new) WHERE is_new = true;

-- เพิ่มข้อมูลตัวอย่าง
INSERT INTO board_games 
(title, creater, publisher, category, year, description, price, original_price, discount, stock, rating, reviews_count, is_new, min_players, max_players, language, cover_image)
VALUES
('Catan', 'Klaus Teuber', 'Kosmos', 'Strategy', 1995, 'เกมวางแผนสร้างอาณานิคมและค้าขายระหว่างผู้เล่น', 1500.00, 1800.00, 20, 10, 4.7, 245, false, 3, 4, 'English', 'https://example.com/images/catan.jpg'),
('Uno', 'Merle Robbins', 'Mattel', 'Card', 1971, 'เกมไพ่ยอดนิยมสำหรับทุกเพศทุกวัย เล่นง่าย สนุกกับเพื่อนและครอบครัว', 150.00, 200.00, 25, 100, 4.5, 1020, true, 2, 10, 'Thai', 'https://example.com/images/uno.jpg'),
('Ticket to Ride', 'Alan R. Moon', 'Days of Wonder', 'Family', 2004, 'เดินทางเก็บเส้นทางรถไฟทั่วอเมริกาเพื่อทำคะแนน', 1800.00, 2000.00, 10, 20, 4.8, 330, true, 2, 5, 'English', 'https://example.com/images/ticket_to_ride.jpg');
