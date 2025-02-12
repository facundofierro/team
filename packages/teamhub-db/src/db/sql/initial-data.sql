INSERT INTO Teacher (id, email, telegramUsername) VALUES ('1', 'example@email.com', 'exampleUsername');

INSERT INTO Student (
  id, 
  email, 
  telegramUsername, 
  level, 
  percentCompleted, 
  teacherId
) 
VALUES (
  '1', 
  'student1@example.com', 
  'student1', 
  'beginner', 
  0, 
  'teacherId1'
);