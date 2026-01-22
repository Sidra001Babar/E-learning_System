import './AssignmentIconAni.css';

export default function FloatingBooks() {
  // List of emojis you want to use
  const emojis = ["📚", "📖", "📝", "📒", "✏️"];

  const books = Array.from({ length: 5 }); // number of floating items

  return (
    <div className="floating-books">
      {books.map((_, i) => {
        const left = Math.random() * 100;
        const duration = 12 + Math.random() * 8;
        const delay = Math.random() * 1;
        const emoji = emojis[Math.floor(Math.random() * emojis.length)];

        return (
          <span
            key={i}
            className="book"
            style={{
              left: `${left}%`,
              animationDuration: `${duration}s`,
              animationDelay: `${delay}s`,
              fontSize: `${16 + Math.random() * 24}px`, // random sizes
            }}
          >
            {emoji}
          </span>
        );
      })}
    </div>
  );
}