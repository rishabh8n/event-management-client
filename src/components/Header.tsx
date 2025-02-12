import useUserStore from "@/store/userStore";
import { Button } from "./ui/button";
import { useNavigate } from "react-router";
import { User2Icon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const { isAuthenticated, user, logout } = useUserStore();
  const navigate = useNavigate();
  return (
    <div className="p-5 md:px-14 flex justify-between items-center">
      <div className="text-primary font-bold text-2xl md:text-3xl">
        Event<span className="text-accent">Hub</span>
      </div>
      {!isAuthenticated ? (
        <div className="flex gap-4">
          <Button
            onClick={() => navigate("/users/login")}
            variant={"ghost"}
            className="p-5 text-accent hover:bg-primary/30 cursor-pointer text-lg"
          >
            Login
          </Button>
          <Button
            onClick={() => navigate("/users/register")}
            className="hidden md:flex p-5 text-lg cursor-pointer text-primary bg-accent hover:bg-accent/70"
          >
            Register
          </Button>
        </div>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger className="cursor-pointer" asChild>
            {user?.avatar ? (
              <img src="user.avatar" className="w-10 h-10 rounded-full" />
            ) : (
              <div className="w-10 h-10 bg-accent rounded-full flex justify-center items-center text-white">
                <User2Icon />
              </div>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 mr-2 bg-secondary text-primary border-primary">
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={() => navigate("/dashboard/edit-profile")}
              >
                Edit Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                Dashboard
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="bg-primary" />
            <DropdownMenuItem onClick={logout}>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};

export default Header;
