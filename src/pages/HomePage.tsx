import Landing from "@/assets/landing.jpg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CalendarIcon, Loader, SearchIcon } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import EventCard from "@/components/EventCard";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";

const HomePage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState<Date>();
  // const [error, setError] = useState(null);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/events");
      setEvents(response.data.data);
    } catch (error: any) {
      // setError(error?.response?.data.message);
      console.log(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEvents();
  }, []);
  return (
    <div className="px-6">
      <div className="w-full h-[80vh] relative">
        <img
          src={Landing}
          alt=""
          className="w-full h-full object-cover rounded-lg"
        />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-center">
          <h1 className="text-5xl font-bold mb-4">
            Plan & Manage Events Effortlessly
          </h1>
          <p className="text-lg mb-6">
            From corporate events to casual meetups, streamline your planning
            with ease.
          </p>
          <Button className="px-6 py-3 text-lg bg-white text-accent shadow-lg hover:bg-gray-200 cursor-pointer">
            Get Started
          </Button>
        </div>
      </div>
      <div className="md:px-4 mt-8 ">
        <h2 className="text-2xl font-bold">Upcoming Events</h2>
      </div>
      <div className="mt-4 flex md:gap-6 md:px-4 flex-col md:flex-row gap-2">
        <div className="relative basis-full md:basis-1/2">
          <SearchIcon className="w-6 h-6 text-primary/50 absolute top-1/2 -translate-y-1/2 left-4" />
          <Input
            type="text"
            placeholder="Search for events"
            className="pl-12 py-6 pr-4 outline-none border-secondary bg-secondary focus:border-accent rounded-full placeholder:text-primary/50"
          />
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button className="basis-full text-primary/50 justify-start md:basis-1/2 py-4 !px-6 outline-none border-secondary bg-secondary focus:border-accent rounded-full hover:bg-secondary">
              <CalendarIcon className="w-6 h-6" />
              {date ? (
                <span className="text-primary">{format(date, "PPP")}</span>
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="mt-4 mb-4 md:px-4 grid xl:grid-cols-4 md:grid-cols-3 gap-6">
        {loading && <Loader />}
        {events.length === 0 && !loading && (
          <div className="text-center text-primary/60">No events found</div>
        )}
        {events.map((event: any) => (
          <EventCard key={event._id} event={event} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
