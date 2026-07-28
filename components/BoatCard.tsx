type BoatCardProps = {
  name: string;
  image: string;
  status: string;
  color: string;
  reason: string;
};

export default function BoatCard({
  name,
  image,
  status,
  color,
  reason,
}: BoatCardProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow">
      <img
        src={image}
        alt={name}
        className="h-24 w-full object-contain"
      />

      <h2 className="text-xl font-bold mt-4 text-gray-900">
        {name}
      </h2>

      <p
        className="font-bold mt-2"
        style={{ color }}
      >
        {status}
      </p>

      <p className="text-gray-700 mt-2">
        {reason}
      </p>
    </div>
  );
}