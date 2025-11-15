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
-- INSERT INTO board_games 
-- (title, creater, publisher, category, year, description, price, original_price, discount, stock, rating, reviews_count, is_new, min_players, max_players, language, cover_image)
-- VALUES
-- ('Catan', 'Klaus Teuber', 'Kosmos', 'Strategy', 1995, 'เกมวางแผนสร้างอาณานิคมและค้าขายระหว่างผู้เล่น', 1500.00, 1800.00, 20, 10, 4.7, 245, false, 3, 4, 'English', '/images/boardgameCover//catan.jpg'),
-- ('Uno', 'Merle Robbins', 'Mattel', 'Card', 1971, 'เกมไพ่ยอดนิยมสำหรับทุกเพศทุกวัย เล่นง่าย สนุกกับเพื่อนและครอบครัว', 150.00, 200.00, 25, 100, 4.5, 1020, true, 2, 10, 'Thai', '/images/boardgameCover//uno.jpg'),
-- ('Ticket to Ride', 'Alan R. Moon', 'Days of Wonder', 'Family', 2004, 'เดินทางเก็บเส้นทางรถไฟทั่วอเมริกาเพื่อทำคะแนน', 1800.00, 2000.00, 10, 20, 4.8, 330, true, 2, 5, 'English', '/images/boardgameCover//ticket_to_ride.jpg');

INSERT INTO board_games (
  title, creater, publisher, category, year, description,
  price, original_price, discount, stock, rating, reviews_count, is_new,
  min_players, max_players, language, cover_image
) VALUES
('Ultimate Werewolf', 'Ted Alspach', 'Bezier Games', 'Party', 2010, 
'เกมสังคมบลัฟและสืบสวน ผู้เล่นจะแบ่งเป็นหมู่บ้านและมนุษย์หมาป่า หมาป่าจะค่อย ๆ กำจัดชาวบ้านในตอนกลางคืน ในขณะที่ชาวบ้านต้องใช้การสังเกต การเดา และการโต้เถียงเพื่อตามหาหมาป่า เกมสนุกและใช้ทักษะการพูด การหลอกล่อ และการวิเคราะห์จิตใจผู้เล่นอื่น',
650.0, 750.0, 10, 80, 4.4, 28, false, 5, 10, 'English', '/images/boardgameCover/1.jpg'),

('Citadels', 'Bruno Faidutti', 'Fantasy Flight Games', 'Strategy', 2000,
'เกมสร้างเมืองและบทบาทที่ต้องวางแผน ผู้เล่นเลือกตัวละครแต่ละรอบเพื่อเก็บเงิน สร้างอาคาร และใช้ความสามารถพิเศษของตัวละครเอาชนะคู่ต่อสู้ เกมต้องใช้กลยุทธ์ การคิดล่วงหน้า และการคาดเดาการเคลื่อนไหวของคนอื่น',
23.0, 30.0, 20, 19, 4.1, 79, false, 2, 8, 'English', '/images/boardgameCover/2.jpg'),

('Geistes Blitz', 'Kristian Köhntopp', 'Ravensburger', 'Party', 2005,
'เกมรีแอคชั่นเร็ว ผู้เล่นต้องหยิบวัตถุให้ตรงกับการ์ดที่เปิดโดยใช้สายตาและความไว วัตถุแต่ละชิ้นมีสีและรูปร่างต่างกัน ทำให้ต้องคิดเร็วและจับจังหวะให้แม่น เกมสนุก เหมาะกับครอบครัวและเด็ก',
10.0, 15.0, 33, 47, 4.5, 56, true, 2, 8, 'English', '/images/boardgameCover/3.jpg'),

('Secret Hitler', 'Max Temkin', 'Goat, Wolf & Cabbage LLC', 'Strategy', 2016,
'เกมสังคมบลัฟและสืบสวน ผู้เล่นแบ่งเป็นฝ่ายลิเบอรัลและฟาสซิสต์ โดยมี “ฮิตเลอร์” หนึ่งคน ฟาสซิสต์ต้องซ่อนตัวและช่วยฮิตเลอร์ขึ้นสู่อำนาจ ในขณะที่ลิเบอรัลต้องสืบหาฮิตเลอร์ เกมเน้นการพูด การเก็บข้อมูล และการบลัฟ',
56.0, 65.0, 14, 13, 4.3, 46, true, 5, 10, 'English', '/images/boardgameCover/4.jpg'),

('Spyfall', 'Alexandra Ushan', 'Cryptozoic Entertainment', 'Party', 2014,
'เกมถาม-ตอบและเดาสายลับ ผู้เล่นทุกคนยกเว้นสายลับรู้สถานที่ที่เล่นอยู่ ผู้เล่นต้องถามตอบกันเพื่อหาว่าสายลับคือใคร ในขณะเดียวกันสายลับต้องคอยปกปิดตัวเอง เกมเน้นการสังเกต การวิเคราะห์ และการสื่อสาร',
50.0, 60.0, 17, 69, 4.2, 51, false, 3, 8, 'English', '/images/boardgameCover/5.jpg'),

('คำต้องห้าม', 'Thai Game Studio', 'Local Publisher', 'Party', 2020,
'เกมปาร์ตี้ที่ผู้เล่นต้องอธิบายคำหรือวลีให้เพื่อนเดาโดยไม่ใช้คำต้องห้าม เกมเน้นความคิดสร้างสรรค์ การสื่อสาร และความสนุกสนาน เหมาะกับทุกเพศทุกวัย',
5.0, 7.0, 28, 48, 3.9, 57, true, 3, 8, 'Thai', '/images/boardgameCover/6.jpg'),

('โยคี', 'Thai Game Studio', 'Local Publisher', 'Party', 2018,
'เกมทายท่าทาง ผู้เล่นต้องทำท่าตามการ์ดที่ได้รับ คนอื่นต้องเดาว่าเป็นคำหรือวลีใด เกมเน้นการเคลื่อนไหว ความสนุก และเสียงหัวเราะ',
55.0, 60.0, 8, 34, 4.0, 4, false, 2, 6, 'Thai', '/images/boardgameCover/7.jpg'),

('Taco Cat Goat Cheese Pizza', 'Dave Campbell', 'Goliath Games', 'Party', 2018,
'เกมการ์ดเร็วและตลก ผู้เล่นสลับกันวางไพ่และต้องพูดคำตามลำดับ หากไพ่ตรงกับคำที่พูด ผู้เล่นต้องรีบกดไพ่ลงกลาง เกมเน้นความไว ความสนุกสนาน และการหัวเราะเป็นวงกลม',
16.0, 20.0, 20, 23, 4.1, 14, false, 2, 8, 'English', '/images/boardgameCover/8.jpg'),

('Camel Up', 'Steffen Bogen', 'Pegasus Spiele', 'Strategy', 2014,
'เกมเดิมพันแข่งอูฐ ผู้เล่นวางเดิมพันบนอูฐที่กำลังแข่งเพื่อชิงรางวัล การแข่งขันเต็มไปด้วยความตื่นเต้นและไม่แน่นอน เกมเน้นโชคและการคาดเดา สามารถเล่นได้ทั้งครอบครัว',
75.0, 80.0, 6, 57, 4.3, 25, true, 2, 8, 'English', '/images/boardgameCover/9.jpg'),

('Ethnos', 'Peter Dunstan', 'CMON Limited', 'Card Game', 2018,
'เกมวางกลยุทธ์สะสมเผ่า ผู้เล่นรวบรวมการ์ดเผ่าเพื่อครองดินแดนต่าง ๆ และได้คะแนน เกมเน้นการวางแผน การสร้างชุดการ์ด และการบริหารทรัพยากร',
69.0, 75.0, 8, 67, 4.2, 12, true, 2, 6, 'English', '/images/boardgameCover/10.jpg'),

('Exploding Kitten Party Pack', 'Elan Lee', 'Exploding Kittens', 'Party', 2016,
'เกมการ์ดตลกและระเบิด ผู้เล่นต้องหลีกเลี่ยงไพ่ “Exploding Kitten” และใช้ไพ่พิเศษเอาตัวรอด เกมรวดเร็ว เล่นง่าย และเหมาะกับปาร์ตี้หรือครอบครัว',
93.0, 100.0, 7, 95, 4.0, 44, false, 2, 6, 'English', '/images/boardgameCover/11.jpg'),

('Mogel Motte', 'Uwe Rosenberg', 'Amigo Spiele', 'Cooperative', 2013,
'เกมบลัฟและจิตวิทยา ผู้เล่นต้องทายและบลัฟเกี่ยวกับจำนวนไพ่แมลง เกมเน้นการอ่านใจ การหลอกล่อ และความสนุกแบบเฮฮา',
75.0, 80.0, 6, 44, 4.1, 67, true, 2, 4, 'German', '/images/boardgameCover/12.jpg'),

('Deception', 'Takeshi Kikuchi', 'Grey Fox Games', 'Party', 2015,
'เกมสืบสวนฆาตกรรม ผู้เล่นแบ่งเป็นนักสืบและผู้ร้าย ผู้เล่นต้องตีความหลักฐานและสื่อสารกันเพื่อหาฆาตกร เกมเน้นความคิดวิเคราะห์ การสังเกต และการบลัฟ',
37.0, 40.0, 8, 17, 4.2, 66, true, 3, 8, 'English', '/images/boardgameCover/13.jpg'),

('Splendor', 'Marc André', 'Space Cowboys', 'Economic', 2014,
'เกมสะสมอัญมณี ผู้เล่นรวบรวมทรัพยากรเพื่อซื้อการ์ดและสะสมคะแนน เกมเน้นการวางแผน การสร้างชุดคอมโบ และกลยุทธ์ระยะยาว',
97.0, 100.0, 5, 84, 4.4, 48, true, 2, 4, 'English', '/images/boardgameCover/14.jpg'),

('เกมการ์ดโอฮาน่า', 'Thai Studio', 'Local Publisher', 'Economic', 2019,
'เกมสร้างเรื่องราวและบลัฟ ผู้เล่นต้องวางการ์ดเพื่อสร้างเรื่องราวหรือกลยุทธ์และเอาชนะคู่ต่อสู้ เกมสนุกและเหมาะกับกลุ่มเพื่อน',
42.0, 50.0, 6, 63, 4.0, 86, true, 2, 6, 'Thai', '/images/boardgameCover/15.jpg'),

('Dixit', 'Jean-Louis Roubira', 'Libellud', 'Strategy', 2008,
'เกมตีความภาพ ผู้เล่นเลือกภาพเพื่อสื่อความหมายและให้คนอื่นเดา เกมเน้นความคิดสร้างสรรค์ การตีความ และจินตนาการ',
33.0, 40.0, 5, 71, 4.5, 57, true, 3, 6, 'French', '/images/boardgameCover/16.jpg'),

('Survive from the Atlantis!', 'Klaus Teuber', 'Kosmos', 'Card Game', 2010,
'เกมเอาชีวิตรอด ผู้เล่นต้องอพยพจากเกาะแอตแลนติสก่อนที่มันจะจมลง ใช้กลยุทธ์และการวางแผนเพื่อรักษาชีวิต เกมเน้นความตื่นเต้นและความคิดเชิงกลยุทธ์',
91.0, 100.0, 8, 10, 4.0, 8, true, 2, 6, 'English', '/images/boardgameCover/17.jpg'),

('Avalon', 'Don Eskridge', 'Indie Boards', 'Family', 2012,
'เกมสังคมบลัฟและสืบสวน ผู้เล่นแบ่งเป็นฝ่ายดีและฝ่ายร้าย ใช้การสังเกต การโต้เถียง และการวิเคราะห์เพื่อเอาชนะ ฝ่ายร้ายต้องซ่อนตัวและฝ่ายดีต้องหาความจริง',
38.0, 45.0, 6, 32, 4.3, 77, true, 3, 6, 'English', '/images/boardgameCover/18.jpg'),

('Settler of Catan', 'Klaus Teuber', 'Kosmos', 'Strategy', 1995,
'เกมสร้างอาณาจักรและแลกทรัพยากร ผู้เล่นสร้างถนน หมู่บ้าน และเมืองเพื่อสะสมคะแนน เกมเน้นกลยุทธ์ การเจรจา และการบริหารทรัพยากร',
68.0, 75.0, 10, 77, 4.6, 58, true, 3, 4, 'English', '/images/boardgameCover/19.jpg'),

('Codenames Pictures', 'Vlaada Chvátil', 'Czech Games Edition', 'Cooperative', 2016,
'เกมสื่อสารโดยคำใบ้ ผู้เล่นต้องจับคู่ภาพที่สื่อความหมายเดียวกันโดยใช้คำใบ้ของเพื่อนทีมเดียวกัน เกมเน้นความคิดสร้างสรรค์ การสื่อสาร และการวิเคราะห์',
47.0, 50.0, 6, 84, 4.2, 64, true, 2, 8, 'English', '/images/boardgameCover/20.jpg');
