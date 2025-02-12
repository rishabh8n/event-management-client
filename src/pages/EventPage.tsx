import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import axios from "@/lib/axios";
import Loader from "@/components/Loader";
import { CalendarIcon, LinkIcon, MapPinIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import useUserStore from "@/store/userStore";
import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_API_URL);

interface Event {
  _id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  imageUrl: string;
  eventUrl: string;
  host: { fullName: string };
}

const EventPage = () => {
  const { isAuthenticated, user } = useUserStore();
  const { id } = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [attendees, setAttendees] = useState<any>([]);
  const navigate = useNavigate();
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(false);
  const fetchEvent = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/events/${id}`);
      const responseAttendee = await axios.get(`/attendees/${id}`);
      setEvent(response.data.data);
      setAttendees(responseAttendee.data.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchAttendees = async () => {
    try {
      const response = await axios.get(`/attendees/${id}`);
      setAttendees(response.data.data);
    } catch (error) {
      console.log;
    }
  };

  const register = async () => {
    try {
      if (!isAuthenticated) {
        return navigate("/users/login");
      }
      await axios.post(`/attendees/${id}/register`);
      setIsRegistered(true);
    } catch (error) {
      console.log(error);
    }
  };

  const unregister = async () => {
    try {
      if (!isAuthenticated) {
        return navigate("/users/login");
      }
      await axios.delete(`/attendees/${id}/unregister`);
      setIsRegistered(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchEvent();
    socket.emit("joinEvent", id);
    socket.on("newAttendee", (data) => {
      setAttendees((prev: any) => [...prev, data]);
    });
    socket.on("attendeeLeft", () => {
      fetchAttendees();
    });
    return () => {
      socket.emit("leaveEvent", id);
      socket.off("newAttendee");
    };
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      const isRegistered = attendees.some((attendee: any) => {
        return attendee.user._id === user?._id;
      });
      if (isRegistered) {
        setIsRegistered(true);
      }
    }
  }, [isAuthenticated, attendees]);

  if (loading) {
    return <Loader />;
  }
  return (
    <div className="p-4">
      <img
        src={event?.imageUrl}
        className="w-full h-90 object-center md:h-[80vh] md:object-cover rounded-lg"
        alt=""
      />
      <div className="p-2 grid md:grid-cols-2">
        <div>
          <h1 className="text-4xl font-bold mt-4">{event?.title}</h1>
          <p className="text-sm text-primary/60 mt-1">
            By {event?.host.fullName}
          </p>
          <p className="mt-2">
            <CalendarIcon className="w-6 h-6 inline-block mr-2 text-accent" />
            {new Date(event?.date || "").toDateString()}
          </p>
          <p className="mt-2">
            <MapPinIcon className="w-6 h-6 inline-block mr-2 text-accent" />
            {event?.location}
          </p>
          {event?.eventUrl && (
            <a
              href="event?.eventUrl"
              className="block text-primary underline mt-2"
            >
              <LinkIcon className="w-6 h-6 inline-block mr-2 text-accent" />
              {event?.eventUrl}
            </a>
          )}
          <Button
            className="mt-4 cursor-pointer bg-accent text-primary"
            onClick={isRegistered ? unregister : register}
          >
            {isRegistered ? "Unregister" : "Register"}
          </Button>
          <h4 className="text-2xl font-semibold my-4">Description</h4>
          <pre className="w-full text-wrap">{event?.description}</pre>
        </div>
        <div className="justify-self-center self-center overflow-y-auto h-90 mt-12 pr-10 bg-primary/10 rounded-lg p-2">
          <h2 className="font-semibold text-xl">
            Attendee List ({attendees.length})
          </h2>
          {attendees.map((attendee: any) => (
            <div key={attendee._id} className="flex items-center my-2">
              {attendee.user.avatar && (
                <img
                  src={attendee.user.avatar}
                  className="w-10 h-10 rounded-full object-cover"
                  alt=""
                />
              )}
              <p className="ml-2">{attendee.user.fullName}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventPage;
