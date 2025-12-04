interface NotFoundProps {
  message?: string;
}

export function NotFound({ message = "No items found" }: NotFoundProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full py-12">
      <div className="flex justify-center mb-4">
        <img 
          src="/sad.svg" 
          alt="Not found"
          width={60}
          height={60}
          className="w-16 h-16"
        />
      </div>
      <h3 className="text-lg font-semibold text-gray-600 mb-2">{message}</h3>
    </div>
  );
}
