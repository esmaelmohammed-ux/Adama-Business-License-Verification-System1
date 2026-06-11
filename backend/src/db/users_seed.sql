USE ketelelema_audit;
// comment
INSERT INTO users (username, password_hash, full_name, role) VALUES
  ('inspector', '$2b$10$kNlzGtzibveS3oyWvg.xOuAsj.KOp7CvuY4Xc4DUoOaHVDiBBnv4.', 'Field Inspector', 'inspector'),
  ('admin', '$2b$10$XtjYgnnMCD6KBBGxsWdIGOWGJLMDgee1J3VW5sHKZsp/.F/dFv5De', 'Office Administrator', 'admin')
ON DUPLICATE KEY UPDATE username = username;
