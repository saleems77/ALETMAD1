export default function PreviewSection({ elements }) {
    return (
      <div className="p-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          {elements.map((element) => (
            <div key={element.id} className="mb-4">
              {element.type === 'text' ? (
                <h2 className="text-xl font-bold">{element.content}</h2>
              ) : (
                <img src={element.content} alt="Uploaded" className="w-full h-48 object-cover" />
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }