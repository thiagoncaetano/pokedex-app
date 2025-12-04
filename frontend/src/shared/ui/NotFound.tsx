interface NotFoundProps {
  message?: string;
}

export function NotFound({ message = "No items found" }: NotFoundProps) {
  return (
    <div className="bg-white rounded-3xl shadow-lg p-3 sm:p-4 md:p-6 mx-1 sm:mx-2 mb-0">
      <div className="mx-auto text-center py-12">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-lg font-semibold text-gray-600 mb-2">{message}</h3>
      </div>
    </div>
  );
}
