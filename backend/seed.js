require('dotenv').config();
const connectDB = require('./config/db');
const User = require('./models/User');
const Book = require('./models/Book');

const sampleBooks = [
  { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', category: 'Fiction', price: 12.99, stock: 25, description: 'A classic of American literature.', image: 'https://covers.openlibrary.org/b/id/7222246-L.jpg' },
  { title: '1984', author: 'George Orwell', category: 'Fiction', price: 10.5, stock: 30, description: 'Dystopian classic.', image: 'https://covers.openlibrary.org/b/id/7222161-L.jpg' },
  { title: 'Sapiens', author: 'Yuval Noah Harari', category: 'History', price: 18, stock: 15, description: 'A brief history of humankind.', image: 'https://covers.openlibrary.org/b/id/8406786-L.jpg' },
  { title: 'A Brief History of Time', author: 'Stephen Hawking', category: 'Science', price: 14, stock: 20, description: 'Cosmology for everyone.', image: 'https://covers.openlibrary.org/b/id/240726-L.jpg' },
  { title: 'Clean Code', author: 'Robert C. Martin', category: 'Technology', price: 30, stock: 18, description: 'A handbook of agile software craftsmanship.', image: 'https://covers.openlibrary.org/b/id/8231856-L.jpg' },
  { title: 'The Pragmatic Programmer', author: 'Andrew Hunt', category: 'Technology', price: 32, stock: 12, description: 'From journeyman to master.', image: 'https://covers.openlibrary.org/b/id/8231990-L.jpg' },
  { title: 'Steve Jobs', author: 'Walter Isaacson', category: 'Biography', price: 22, stock: 10, description: 'The exclusive biography.', image: 'https://covers.openlibrary.org/b/id/7222125-L.jpg' },
  { title: 'Educated', author: 'Tara Westover', category: 'Biography', price: 16, stock: 14, description: 'A memoir.', image: 'https://covers.openlibrary.org/b/id/8902172-L.jpg' },
  { title: 'Where the Wild Things Are', author: 'Maurice Sendak', category: 'Children', price: 9, stock: 40, description: 'A classic picture book.', image: 'https://covers.openlibrary.org/b/id/8775116-L.jpg' },
  { title: 'Charlotte\'s Web', author: 'E. B. White', category: 'Children', price: 8, stock: 35, description: "A tale of friendship.", image: 'https://covers.openlibrary.org/b/id/8231996-L.jpg' },
  { title: 'Thinking, Fast and Slow', author: 'Daniel Kahneman', category: 'Non-Fiction', price: 17, stock: 22, description: 'Two systems of thought.', image: 'https://covers.openlibrary.org/b/id/7898938-L.jpg' },
  { title: 'Atomic Habits', author: 'James Clear', category: 'Non-Fiction', price: 15, stock: 28, description: 'Build good habits.', image: 'https://covers.openlibrary.org/b/id/10523284-L.jpg' },
  { title: 'To Kill a Mockingbird', author: 'Harper Lee', category: 'Fiction', price: 11, stock: 26, description: 'Pulitzer Prize-winning novel.', image: 'https://covers.openlibrary.org/b/id/8231443-L.jpg' },
  { title: 'The Selfish Gene', author: 'Richard Dawkins', category: 'Science', price: 16, stock: 17, description: 'Gene-centered view of evolution.', image: 'https://covers.openlibrary.org/b/id/8281992-L.jpg' },
  { title: 'Cosmos', author: 'Carl Sagan', category: 'Science', price: 19, stock: 13, description: 'The cosmos is all that is.', image: 'https://covers.openlibrary.org/b/id/8231717-L.jpg' },
  { title: 'Guns, Germs, and Steel', author: 'Jared Diamond', category: 'History', price: 17, stock: 16, description: 'The fates of human societies.', image: 'https://covers.openlibrary.org/b/id/8775039-L.jpg' },
  { title: 'The Diary of a Young Girl', author: 'Anne Frank', category: 'Biography', price: 10, stock: 24, description: 'Wartime diary.', image: 'https://covers.openlibrary.org/b/id/8231856-L.jpg' },
  { title: 'Eloquent JavaScript', author: 'Marijn Haverbeke', category: 'Technology', price: 25, stock: 19, description: 'A modern introduction to programming.', image: 'https://covers.openlibrary.org/b/id/9259237-L.jpg' },
  { title: 'The Lean Startup', author: 'Eric Ries', category: 'Non-Fiction', price: 18, stock: 21, description: 'How constant innovation creates radically successful businesses.', image: 'https://covers.openlibrary.org/b/id/7222246-L.jpg' },
  { title: 'Goodnight Moon', author: 'Margaret Wise Brown', category: 'Children', price: 7, stock: 50, description: 'A bedtime classic.', image: 'https://covers.openlibrary.org/b/id/8231996-L.jpg' },
];

(async () => {
  await connectDB();
  await User.deleteMany({});
  await Book.deleteMany({});
  await User.create({
    name: 'Admin',
    email: 'admin@bookstore.com',
    password: 'Admin@123',
    phone: '+10000000000',
    role: 'admin',
    isPhoneVerified: true,
  });
  await Book.insertMany(sampleBooks);
  console.log(`Seeded admin + ${sampleBooks.length} books`);
  process.exit(0);
})();
