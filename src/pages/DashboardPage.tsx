import Loader from "@/components/Loader";
import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import EventCard from "@/components/EventCard";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";

const DashboardPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [attendedEvents, setAttendedEvents] = useState([]);
  const [hostedEvents, setHostedEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const navigate = useNavigate();

  const fetchEvents = async () => {
    try {
      const response = await axios.get("/events/my-events");
      const events = response.data.data;
      setAttendedEvents(events.filter((event: any) => !event.isHost));
      setHostedEvents(events.filter((event: any) => event.isHost));
      setPastEvents(
        events.filter((event: any) => new Date(event.date) < new Date())
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    // fetch events
    fetchEvents();
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold w-full flex justify-between">
        Hosted Events
        <Button onClick={() => navigate("/dashboard/create-event")}>
          Create New Event
        </Button>
      </h2>
      <div className="mt-4 flex md:gap-6 md:px-4 flex-col md:flex-row gap-2">
        {hostedEvents.map((event: any) => (
          <EventCard key={event._id} event={event} />
        ))}
      </div>
      <h2 className="mt-6 text-2xl font-bold">My Events</h2>
      <div className="mt-4 flex md:gap-6 md:px-4 flex-col md:flex-row gap-2">
        {attendedEvents.map((event: any) => (
          <EventCard key={event._id} event={event} />
        ))}
      </div>
      <h2 className="mt-6 text-2xl font-bold">Past Events</h2>
      <div className="mt-4 flex md:gap-6 md:px-4 flex-col md:flex-row gap-2">
        {pastEvents.map((event: any) => (
          <EventCard key={event._id} event={event} />
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;
