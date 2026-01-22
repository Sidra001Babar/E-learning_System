import "./MovingShapes.css";

export default function MovingShapes({ count = 30 }) {
  return (
    <div className="moving-shapes">
      {Array.from({ length: count }).map((_, i) => {
        const shapeType =
          i % 3 === 0 ? "square" : i % 3 === 1 ? "circle" : "triangle";

        return <span key={i} className={`shape ${shapeType}`}></span>;
      })}
    </div>
  );
}
