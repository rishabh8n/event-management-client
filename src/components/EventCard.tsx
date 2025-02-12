import { useNavigate } from "react-router";

interface Event {
  _id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  imageUrl: string;
  host: { fullName: string };
}

const EventCard = ({ event }: { event: Event }) => {
  const { title, date, location, imageUrl, host } = event;
  const parsedDate = new Date(date);
  const formattedDate = parsedDate.toDateString();
  const navigate = useNavigate();
  return (
    <div
      className="w-full bg-primary/5 overflow-hidden rounded-lg max-w-100"
      onClick={() => navigate(`/events/${event._id}`)}
    >
      <img src={imageUrl} alt="" className="w-full h-48 object-cover" />
      <div className="p-4">
        <p className="text-sm text-accent">{formattedDate}</p>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-primary/80">{location}</p>
        <p className="mt-2 text-sm text-primary/60">
          Hosted By: {host?.fullName}
        </p>
      </div>
    </div>
  );
};

export default EventCard;
