import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { useState } from "react";
import axios from "@/lib/axios";
import { useNavigate } from "react-router";

const formSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(3),
  date: z.date(),
  location: z.string().min(2),
});

const CreateEventPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [image, setImage] = useState<any>("");
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      date: new Date(),
      location: "",
    },
  });
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setError("");
      if (!image) return setError("No image attached");
      setIsLoading(true);
      const formData = new FormData();
      formData.append("image", image);
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("location", data.location);
      formData.append("date", data.date.toDateString());
      const response = await axios.post("/events", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.status === 201) navigate("/dashboard");
      setIsLoading(false);
    } catch (error: any) {
      console.log(error);
      setError(error.response.data.message);
      setIsLoading(false);
    }
  };
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">Create Event</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mt-4 space-y-4 w-full"
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    className="w-full py-6 px-4 outline-none border-secondary bg-secondary focus:border-accent rounded-sm placeholder:text-primary/50"
                    placeholder="Title"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    {...field}
                    className="resize-none h-50 w-full py-6 px-4 outline-none border-secondary bg-secondary focus:border-accent rounded-sm placeholder:text-primary/50"
                    placeholder="Description"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Input
            type="file"
            className="w-full py-6 px-4 outline-none border-secondary bg-secondary focus:border-accent rounded-sm placeholder:text-primary/50"
            placeholder="Title"
            onChange={(e) => {
              if (e.target.files) setImage(e.target.files[0]);
            }}
          />
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button className="basis-full text-primary/50 justify-start md:basis-1/2 py-6 !px-6 outline-none border-secondary bg-secondary focus:border-accent rounded-sm hover:bg-secondary">
                        <CalendarIcon className="w-6 h-6" />
                        {field.value ? (
                          <span className="text-primary">
                            {format(field.value, "PPP")}
                          </span>
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    className="w-full py-6 px-4 outline-none border-secondary bg-secondary focus:border-accent rounded-sm placeholder:text-primary/50"
                    placeholder="Location"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="mt-4 w-full p-6 bg-accent text-primary rounded-sm hover:bg-accent/80 cursor-pointer"
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Submit"}
          </Button>
          <p className="text-red-500 text-center">{error}</p>
        </form>
      </Form>
    </div>
  );
};

export default CreateEventPage;
