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

INSERT INTO board_games (
  title, creater, publisher, category, year, description,
  price, original_price, discount, stock, rating, reviews_count, is_new,
  min_players, max_players, language, cover_image
) VALUES
('Ultimate Werewolf', 'Ted Alspach', 'Bezier Games', 'Party', 2010, 'เกมสืบสวนและปริศนา ผู้เล่นต้องหาตัวผู้ร้ายในหมู่คนอื่น', 650.0, 750.0, 10, 80, 4.4, 28, false, 5, 10, 'English', 'https://www.goldengoblingames.com/ultimate-werewolf-deluxe-edition-8979.jpg'),
('Citadels', 'Bruno Faidutti', 'Fantasy Flight Games', 'Strategy', 2000, 'เกมสร้างเมือง แข่งขันบัตรบทบาทต่างๆ', 23.0, 30.0, 20, 19, 4.1, 79, false, 2, 8, 'English', 'https://example.com/images/citadels.jpg'),
('Geistes Blitz', 'Kristian Köhntopp', 'Ravensburger', 'Party', 2005, 'เกมสังเกตและเร็วในการจับไอเทมที่ตรงกัน', 10.0, 15.0, 33, 47, 4.5, 56, true, 2, 8, 'English', 'https://example.com/images/geistes_blitz.jpg'),
('Secret Hitler', 'Max Temkin', 'Goat, Wolf & Cabbage LLC', 'Strategy', 2016, 'เกมการเมืองแฝงตัว เป็นฝ่ายลับและฝ่ายเปิดเผย', 56.0, 65.0, 14, 13, 4.3, 46, true, 5, 10, 'English', 'https://example.com/images/secret_hitler.jpg'),
('Spyfall', 'Alexandra Ushan', 'Cryptozoic Entertainment', 'Party', 2014, 'เกมถามตอบสืบสวนผู้เล่นที่เป็นสายลับ', 50.0, 60.0, 17, 69, 4.2, 51, false, 3, 8, 'English', 'https://example.com/images/spyfall.jpg'),
('คำต้องห้าม', 'Thai Game Studio', 'Local Publisher', 'Party', 2020, 'เกมทายคำ ต้องห้ามพูดบางคำ', 5.0, 7.0, 28, 48, 3.9, 57, true, 3, 8, 'Thai', 'https://example.com/images/คำต้องห้าม.jpg'),
('โยคี', 'Thai Game Studio', 'Local Publisher', 'Party', 2018, 'เกมวางแผนแบบง่ายๆ สำหรับทุกเพศทุกวัย', 55.0, 60.0, 8, 34, 4.0, 4, false, 2, 6, 'Thai', 'https://example.com/images/โยคี.jpg'),
('Taco Cat Goat Cheese Pizza', 'Dave Campbell', 'Goliath Games', 'Party', 2018, 'เกมไพ่เร็วและฮา เหมาะกับปาร์ตี้', 16.0, 20.0, 20, 23, 4.1, 14, false, 2, 8, 'English', 'https://example.com/images/taco_cat_goat.jpg'),
('Camel Up', 'Steffen Bogen', 'Pegasus Spiele', 'Strategy', 2014, 'เกมแข่งอูฐที่ผู้เล่นเดิมพันเพื่อชนะ', 75.0, 80.0, 6, 57, 4.3, 25, true, 2, 8, 'English', 'https://example.com/images/camel_up.jpg'),
('Ethnos', 'Peter Dunstan', 'CMON Limited', 'Card Game', 2018, 'เกมการ์ดแฟนตาซี แข่งชิงพื้นที่และคะแนน', 69.0, 75.0, 8, 67, 4.2, 12, true, 2, 6, 'English', 'https://example.com/images/ethnos.jpg'),
('Exploding Kitten Party Pack', 'Elan Lee', 'Exploding Kittens', 'Party', 2016, 'เกมไพ่ระเบิด ที่ต้องวางแผนหลีกเลี่ยงระเบิด', 93.0, 100.0, 7, 95, 4.0, 44, false, 2, 6, 'English', 'https://example.com/images/exploding_kitten.jpg'),
('Mogel Motte', 'Uwe Rosenberg', 'Amigo Spiele', 'Cooperative', 2013, 'เกมร่วมมือปกป้องตัวอ่อนแมลง', 75.0, 80.0, 6, 44, 4.1, 67, true, 2, 4, 'German', 'https://example.com/images/mogel_motte.jpg'),
('Deception', 'Takeshi Kikuchi', 'Grey Fox Games', 'Party', 2015, 'เกมสืบสวน แก้ปริศนาฆาตกรรม', 37.0, 40.0, 8, 17, 4.2, 66, true, 3, 8, 'English', 'https://example.com/images/deception.jpg'),
('Splendor', 'Marc André', 'Space Cowboys', 'Economic', 2014, 'เกมสะสมเพชรและสร้างอาณาจักร', 97.0, 100.0, 5, 84, 4.4, 48, true, 2, 4, 'English', 'https://example.com/images/splendor.jpg'),
('เกมการ์ดโอฮาน่า', 'Thai Studio', 'Local Publisher', 'Economic', 2019, 'เกมการ์ดเล่นง่ายสำหรับครอบครัว', 42.0, 50.0, 6, 63, 4.0, 86, true, 2, 6, 'Thai', 'https://example.com/images/ohana.jpg'),
('Dixit', 'Jean-Louis Roubira', 'Libellud', 'Strategy', 2008, 'เกมเล่าเรื่องด้วยภาพและจินตนาการ', 33.0, 40.0, 5, 71, 4.5, 57, true, 3, 6, 'French', 'https://example.com/images/dixit.jpg'),
('Survive from the Atlantis!', 'Klaus Teuber', 'Kosmos', 'Card Game', 2010, 'เกมเอาชีวิตรอดใต้ทะเลแอตแลนติส', 91.0, 100.0, 8, 10, 4.0, 8, true, 2, 6, 'English', 'https://example.com/images/survive_atlantis.jpg'),
('Avalon', 'Don Eskridge', 'Indie Boards', 'Family', 2012, 'เกมปาร์ตี้แฟมิลี่ เล่นง่าย', 38.0, 45.0, 6, 32, 4.3, 77, true, 3, 6, 'English', 'https://example.com/images/avalon.jpg'),
('Settler of Catan', 'Klaus Teuber', 'Kosmos', 'Strategy', 1995, 'เกมวางแผนสร้างอาณานิคมและค้าขายระหว่างผู้เล่น', 68.0, 75.0, 10, 77, 4.6, 58, true, 3, 4, 'English', 'https://example.com/images/settler_catan.jpg'),
('Codenames Pictures', 'Vlaada Chvátil', 'Czech Games Edition', 'Cooperative', 2016, 'เกมสื่อสารสัญลักษณ์ให้เพื่อนเดา', 47.0, 50.0, 6, 84, 4.2, 64, true, 2, 8, 'English', 'https://example.com/images/codenames_pictures.jpg');
