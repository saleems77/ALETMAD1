export default function InteractionTimeline({ interactions }) {
    return (
      <div className="space-y-4">
        {interactions.map(interaction => (
          <div key={interaction.id} className="flex items-start gap-4 p-4 border rounded">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
            <div>
              <p className="font-medium">{new Date(interaction.date).toLocaleDateString('ar-SA')}</p>
              <p className="text-gray-600">{interaction.notes}</p>
            </div>
          </div>
        ))}
      </div>
    );
  }