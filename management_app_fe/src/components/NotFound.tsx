import { FileX, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

interface NotFoundProps {
  title?: string;
  description?: string;
  showHomeButton?: boolean;
}

const NotFound = ({
  title = "Page Not Found",
  description = "The page you're looking for doesn't exist or has been moved.",
  showHomeButton = true,
}: NotFoundProps) => {
  return (
    <div className="flex items-center justify-center min-h-[400px] p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
            <FileX className="h-6 w-6 text-gray-600" />
          </div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        {showHomeButton && (
          <CardContent className="text-center">
            <Link href="/dashboard">
              <Button>
                <Home className="h-4 w-4 mr-2" />
                Go to Dashboard
              </Button>
            </Link>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default NotFound;
