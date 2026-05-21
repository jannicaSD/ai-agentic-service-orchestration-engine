-- Seed data for demo providers (30 entries across cities and categories)
insert into providers (id, name, phone, city, area, categories, base_rate, rating, reliability_score, cancellation_rate, capacity, availability, tags)
values
-- 1
('00000000-0000-0000-0000-000000000001','Ali Plumbing','+923001234001','Lahore','DHA','{plumber}',1200,4.6,0.92,0.02,2,'{"slots":[]}','{"languages": ["urdu","english"]}'),
('00000000-0000-0000-0000-000000000002','Zain Electric','+923001234002','Karachi','Clifton','{electrician}',1000,4.4,0.9,0.03,3,'{"slots":[]}','{"languages": ["urdu","english"]}'),
('00000000-0000-0000-0000-000000000003','Sara AC Services','+923001234003','Lahore','Gulberg','{ac_technician}',1500,4.7,0.95,0.01,2,'{"slots":[]}','{"languages": ["urdu","english"]}'),
('00000000-0000-0000-0000-000000000004','Bilal Mechanics','+923001234004','Rawalpindi','Satellite','{mechanic}',1800,4.5,0.89,0.04,1,'{"slots":[]}','{"languages": ["urdu"]}'),
('00000000-0000-0000-0000-000000000005','Hina Tutors','+923001234005','Islamabad','F6','{tutor}',800,4.8,0.97,0.005,5,'{"slots":[]}','{"languages": ["urdu","english"]}'),
('00000000-0000-0000-0000-000000000006','Rida Salon','+923001234006','Karachi','Gulshan','{beautician}',900,4.3,0.88,0.06,2,'{"slots":[]}','{"languages": ["urdu","roman_ur"]}'),
('00000000-0000-0000-0000-000000000007','CleanPro','+923001234007','Lahore','Model Town','{cleaner}',700,4.2,0.85,0.05,4,'{"slots":[]}','{"languages": ["urdu"]}'),
('00000000-0000-0000-0000-000000000008','Aamir Electric','+923001234008','Karachi','North Nazimabad','{electrician}',1100,4.1,0.8,0.07,2,'{"slots":[]}','{"languages": ["urdu","english"]}'),
('00000000-0000-0000-0000-000000000009','Nida Plumbing','+923001234009','Islamabad','Blue Area','{plumber}',1300,4.6,0.93,0.02,2,'{"slots":[]}','{"languages": ["urdu"]}'),
('00000000-0000-0000-0000-000000000010','Omar AC','+923001234010','Lahore','Johar Town','{ac_technician}',1600,4.4,0.9,0.03,1,'{"slots":[]}','{"languages": ["urdu","english"]}'),
('00000000-0000-0000-0000-000000000011','Farah Tutor','+923001234011','Karachi','DHA','{tutor}',750,4.9,0.98,0.002,6,'{"slots":[]}','{"languages": ["english"]}'),
('00000000-0000-0000-0000-000000000012','Khan Mechanics','+923001234012','Rawalpindi','Gulzar','{mechanic}',1700,4.0,0.78,0.08,1,'{"slots":[]}','{"languages": ["urdu"]}'),
('00000000-0000-0000-0000-000000000013','Zara Cleaning','+923001234013','Islamabad','E11','{cleaner}',650,4.5,0.9,0.04,3,'{"slots":[]}','{"languages": ["urdu","roman_ur"]}'),
('00000000-0000-0000-0000-000000000014','Sami Electric','+923001234014','Lahore','Anarkali','{electrician}',1050,4.3,0.86,0.05,2,'{"slots":[]}','{"languages": ["urdu"]}'),
('00000000-0000-0000-0000-000000000015','Nawaz Plumbers','+923001234015','Karachi','PECHS','{plumber}',1250,4.2,0.84,0.06,2,'{"slots":[]}','{"languages": ["urdu","english"]}'),
('00000000-0000-0000-0000-000000000016','Ayesha Salon','+923001234016','Lahore','Bahadurabad','{beautician}',950,4.7,0.9,0.03,2,'{"slots":[]}','{"languages": ["urdu","roman_ur"]}'),
('00000000-0000-0000-0000-000000000017','Rauf AC','+923001234017','Karachi','Gulistan-e-Johar','{ac_technician}',1550,4.1,0.82,0.07,1,'{"slots":[]}','{"languages": ["urdu"]}'),
('00000000-0000-0000-0000-000000000018','Iqbal Mechanics','+923001234018','Rawalpindi','Chaklala','{mechanic}',1750,4.6,0.9,0.03,1,'{"slots":[]}','{"languages": ["urdu"]}'),
('00000000-0000-0000-0000-000000000019','Laila Tutor','+923001234019','Islamabad','F8','{tutor}',820,4.7,0.96,0.01,4,'{"slots":[]}','{"languages": ["english","urdu"]}'),
('00000000-0000-0000-0000-000000000020','Bright Cleaners','+923001234020','Lahore','Sabzazar','{cleaner}',680,4.0,0.8,0.07,3,'{"slots":[]}','{"languages": ["urdu"]}'),
('00000000-0000-0000-0000-000000000021','Hafeez Electric','+923001234021','Karachi','Korangi','{electrician}',980,3.9,0.75,0.09,2,'{"slots":[]}','{"languages": ["urdu"]}'),
('00000000-0000-0000-0000-000000000022','Mumtaz Plumbing','+923001234022','Lahore','Gaddafi','{plumber}',1400,4.8,0.96,0.01,2,'{"slots":[]}','{"languages": ["urdu","roman_ur"]}'),
('00000000-0000-0000-0000-000000000023','Tariq Mechanics','+923001234023','Rawalpindi','Westridge','{mechanic}',1650,4.2,0.85,0.05,1,'{"slots":[]}','{"languages": ["urdu"]}'),
('00000000-0000-0000-0000-000000000024','Noreen Salon','+923001234024','Karachi','Saddar','{beautician}',880,4.4,0.88,0.04,2,'{"slots":[]}','{"languages": ["urdu","english"]}'),
('00000000-0000-0000-0000-000000000025','Smart Tutors','+923001234025','Lahore','LDA','{tutor}',780,4.6,0.94,0.02,5,'{"slots":[]}','{"languages": ["english"]}'),
('00000000-0000-0000-0000-000000000026','Urban Clean','+923001234026','Islamabad','I-8','{cleaner}',700,4.1,0.82,0.06,3,'{"slots":[]}','{"languages": ["urdu"]}'),
('00000000-0000-0000-0000-000000000027','Faisal Electric','+923001234027','Karachi','Nazimabad','{electrician}',1150,4.5,0.91,0.02,2,'{"slots":[]}','{"languages": ["urdu"]}'),
('00000000-0000-0000-0000-000000000028','Shoaib Plumbers','+923001234028','Lahore','Shadman','{plumber}',1280,4.3,0.87,0.04,2,'{"slots":[]}','{"languages": ["urdu","roman_ur"]}'),
('00000000-0000-0000-0000-000000000029','Rana Mechanics','+923001234029','Rawalpindi','Adyala','{mechanic}',1720,4.0,0.79,0.06,1,'{"slots":[]}','{"languages": ["urdu"]}'),
('00000000-0000-0000-0000-000000000030','Aila Tutors','+923001234030','Islamabad','G-6','{tutor}',790,4.8,0.97,0.01,4,'{"slots":[]}','{"languages": ["english","urdu"]}');

-- Note: adjust IDs, auth_user references as needed when importing into Supabase.
