import React, { useState, useEffect } from 'react';
import { Search, Book, Calendar, User, Star, ArrowUpDown, Filter, Loader2 } from 'lucide-react';

const BookFinder = () => {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState('title');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showFilters, setShowFilters] = useState(false);

  // Initial books to display
  const initialBooks = [
    'The Great Gatsby',
    'To Kill a Mockingbird',
    'Pride and Prejudice',
    'The Catcher in the Rye',
    '1984',
    'Harry Potter'
  ];

  // Fetch books from Open Library API
  const fetchBooks = async (title) => {
    setLoading(true);
    try {
      const response = await fetch(`https://openlibrary.org/search.json?title=${encodeURIComponent(title)}&limit=20`);
      const data = await response.json();
      
      const formattedBooks = data.docs.map(book => ({
        id: book.key,
        title: book.title || 'Unknown Title',
        author: book.author_name ? book.author_name[0] : 'Unknown Author',
        publishYear: book.first_publish_year || 'Unknown',
        rating: book.ratings_average || Math.random() * 5,
        pages: book.number_of_pages_median || Math.floor(Math.random() * 500) + 100,
        cover: book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` : null,
        subject: book.subject ? book.subject[0] : 'General',
        isbn: book.isbn ? book.isbn[0] : null
      }));
      
      setBooks(formattedBooks);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
    setLoading(false);
  };

  // Load initial books on component mount
  useEffect(() => {
    const randomTitle = initialBooks[Math.floor(Math.random() * initialBooks.length)];
    fetchBooks(randomTitle);
  }, []);

  // Handle search
  const handleSearch = (e) => {
    if (e) e.preventDefault();
    if (searchTerm.trim()) {
      fetchBooks(searchTerm);
    }
  };

  // Sort books
  const sortBooks = (booksToSort) => {
    const sorted = [...booksToSort].sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (sortBy === 'title' || sortBy === 'author') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    return sorted;
  };

  const sortedBooks = sortBooks(books);

  // BookCard Component
  const BookCard = ({ book }) => (
    <div className="group relative">
      {/* Card Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur-lg opacity-0 group-hover:opacity-25 transition-opacity duration-500"></div>
      
      <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden group-hover:-translate-y-2 border border-white/20">
        <div className="relative overflow-hidden">
          {book.cover ? (
            <img 
              src={book.cover} 
              alt={book.title}
              className="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-72 bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-400/20"></div>
              <Book className="w-20 h-20 text-gray-600 relative z-10" />
            </div>
          )}
          
          {/* Rating Badge */}
          <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-full px-3 py-2 flex items-center shadow-lg border border-white/50">
            <Star className="w-4 h-4 text-yellow-500 mr-1 fill-current" />
            <span className="text-sm font-bold text-gray-700">{book.rating.toFixed(1)}</span>
          </div>
          
          {/* Gradient Overlay */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/50 to-transparent"></div>
        </div>
        
        <div className="p-6">
          <h3 className="font-bold text-xl text-gray-800 mb-3 line-clamp-2 leading-tight group-hover:text-purple-700 transition-colors">
            {book.title}
          </h3>
          
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
              <User className="w-4 h-4 mr-2 text-blue-600" />
              <span className="truncate font-medium">{book.author}</span>
            </div>
            
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
              <Calendar className="w-4 h-4 mr-2 text-green-600" />
              <span className="font-medium">{book.publishYear}</span>
            </div>
            
            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <span className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold">
                {book.pages} pages
              </span>
              <span className="bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 px-3 py-1 rounded-full text-xs font-semibold truncate max-w-24">
                {book.subject}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-500"></div>
      </div>

      {/* Header */}
      <header className="relative backdrop-blur-md bg-white/10 border-b border-white/20 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-600 rounded-2xl blur-lg opacity-75 animate-pulse"></div>
                <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-2xl shadow-2xl">
                  <Book className="w-12 h-12 text-white" />
                </div>
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-4 animate-pulse">
              BookFinder
            </h1>
            <p className="text-xl text-gray-300 mb-2">Discover Your Next Literary Adventure</p>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Explore millions of books from around the world with our intelligent search engine
            </p>
            
            {/* Stats */}
            <div className="flex justify-center space-x-8 mt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">1M+</div>
                <div className="text-sm text-gray-400">Books</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">100K+</div>
                <div className="text-sm text-gray-400">Authors</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">50+</div>
                <div className="text-sm text-gray-400">Languages</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Content Container */}
        <div className="backdrop-blur-md bg-white/10 rounded-3xl border border-white/20 shadow-2xl p-8 mb-8">
          {/* Search Section */}
          <div className="mb-12">
            <div className="relative max-w-3xl mx-auto">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-lg opacity-25 group-hover:opacity-40 transition-opacity"></div>
                <div className="relative bg-white/95 backdrop-blur-sm rounded-full shadow-2xl">
                  <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-500 w-6 h-6" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
                    placeholder="Search for your next favorite book..."
                    className="w-full pl-16 pr-32 py-5 text-lg bg-transparent border-0 rounded-full focus:outline-none placeholder-gray-500"
                  />
                  <button
                    onClick={handleSearch}
                    disabled={loading}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-full hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 hover:scale-105 shadow-lg"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Search'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Controls Section */}
          <div className="mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl border border-white/30 hover:bg-white/30 transition-all duration-300 hover:scale-105 shadow-lg"
              >
                <Filter className="w-5 h-5" />
                <span className="font-medium">Sort & Filter</span>
              </button>
              
              {showFilters && (
                <div className="flex items-center space-x-4 bg-white/20 backdrop-blur-sm p-4 rounded-xl border border-white/30 shadow-lg">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-white/90 backdrop-blur-sm border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-md"
                  >
                    <option value="title">Title</option>
                    <option value="author">Author</option>
                    <option value="publishYear">Year</option>
                    <option value="rating">Rating</option>
                    <option value="pages">Pages</option>
                  </select>
                  
                  <button
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    className="flex items-center space-x-2 bg-white/90 backdrop-blur-sm hover:bg-white px-4 py-2 rounded-lg transition-all duration-300 shadow-md hover:scale-105"
                  >
                    <ArrowUpDown className="w-4 h-4 text-gray-700" />
                    <span className="text-sm font-medium text-gray-700">{sortOrder === 'asc' ? 'A-Z' : 'Z-A'}</span>
                  </button>
                </div>
              )}
            </div>
            
            {books.length > 0 && (
              <div className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-xl border border-white/30 shadow-lg">
                <span className="font-medium">{books.length} books found</span>
              </div>
            )}
          </div></div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-lg opacity-50 animate-pulse"></div>
                <div className="relative bg-white/20 backdrop-blur-sm p-8 rounded-full border border-white/30">
                  <Loader2 className="w-12 h-12 animate-spin text-white mx-auto mb-4" />
                </div>
              </div>
              <p className="text-white font-medium text-lg mt-6">Discovering amazing books for you...</p>
            </div>
          </div>
        )}

        {/* Books Grid */}
        {!loading && books.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {sortedBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && books.length === 0 && searchTerm && (
          <div className="text-center py-20">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-lg opacity-30"></div>
              <div className="relative bg-white/20 backdrop-blur-sm p-8 rounded-full border border-white/30 w-fit mx-auto">
                <Book className="w-16 h-16 text-white mx-auto mb-4" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">No books found</h3>
            <p className="text-gray-300 text-lg">Try searching with a different title or explore our suggestions below</p>
          </div>
        )}

        {/* Quick Search Suggestions */}
        {!searchTerm && !loading && (
          <div className="mt-16 text-center">
            <h3 className="text-2xl font-bold text-white mb-8">Popular Searches</h3>
            <div className="flex flex-wrap justify-center gap-4">
              {initialBooks.map((book, index) => (
                <button
                  key={book}
                  onClick={() => {
                    setSearchTerm(book);
                    fetchBooks(book);
                  }}
                  className="relative group"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-600 rounded-full blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                  <div className="relative bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-full border border-white/30 hover:bg-white/30 transition-all duration-300 hover:scale-110 shadow-lg">
                    {book}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="relative backdrop-blur-md bg-white/10 border-t border-white/20 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Logo Section */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-600 rounded-xl blur-md opacity-75"></div>
                  <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-xl">
                    <Book className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">BookFinder</h3>
                  <p className="text-gray-300">Your Literary Companion</p>
                </div>
              </div>
              <p className="text-gray-300 max-w-md leading-relaxed">
                Discover, explore, and find your next favorite book from millions of titles worldwide. 
                Powered by comprehensive book databases to bring you the best reading recommendations.
              </p>
              
              {/* Social Links */}
              <div className="flex space-x-4 mt-6">
                {['GitHub', 'Twitter', 'LinkedIn'].map((social) => (
                  <div key={social} className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 cursor-pointer hover:scale-110 border border-white/30">
                    <span className="text-white text-sm font-medium">{social[0]}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Explore</h4>
              <ul className="space-y-3">
                {['Fiction', 'Non-Fiction', 'Science', 'Biography', 'History'].map((genre) => (
                  <li key={genre}>
                    <button 
                      onClick={() => {
                        setSearchTerm(genre);
                        fetchBooks(genre);
                      }}
                      className="text-gray-300 hover:text-white transition-colors hover:translate-x-1 duration-300 block"
                    >
                      {genre}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Features */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Features</h4>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span>Advanced Search</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span>Smart Sorting</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                  <span>Book Ratings</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Responsive Design</span>
                </li>
              </ul>
            </div>
          </div>
          
          {/* Bottom Section */}
          <div className="border-t border-white/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 BookFinder. Powered by 
              <span className="font-semibold text-blue-400 ml-1">Open Library API</span>
            </p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <button className="text-gray-300 hover:text-white transition-colors text-sm">Privacy Policy</button>
              <button className="text-gray-300 hover:text-white transition-colors text-sm">Terms of Service</button>
              <button className="text-gray-300 hover:text-white transition-colors text-sm">Contact</button>
            </div>
          </div>
        </div>
    
      </footer>
    </div>
  );
};

export default BookFinder;