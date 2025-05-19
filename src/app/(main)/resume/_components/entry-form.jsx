"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, parse } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { experienceSchema, educationSchema, projectSchema } from "@/app/lib/schema";
import { Sparkles, PlusCircle, X, Pencil, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { improveWithAI } from "../../../../../actions/resume";
import useFetch from "../../../../../hooks/use-fetch";

const formatDisplayDate = (dateString) => {
  if (!dateString) return "";
  const date = parse(dateString, "yyyy-MM", new Date());
  return format(date, "MMM yyyy");
};

export function EntryForm({ type, entries, onChange }) {
  const [isAdding, setIsAdding] = useState(false);
  
  // Select the appropriate schema based on entry type
  const getSchemaForType = () => {
    switch (type.toLowerCase()) {
      case "Education":
        return educationSchema;
      case "Project":
        return projectSchema;
      case "Experience":
      default:
        return experienceSchema;
    }
  };

  // Get default values based on entry type
  const getDefaultValues = () => {
    const commonFields = {
      title: "",
      organization: "",
      startDate: "",
      endDate: "",
      description: "",
      current: false,
    };

    switch (type.toLowerCase()) {
      case "education":
        return {
          ...commonFields,
          organization: "", // School/University
          degree: "",
          gpa: "",
        };
      case "project":
        return {
          ...commonFields,
          organization: "", // Optional for projects
          projectUrl: "",
          technologies: "",
        };
      case "experience":
      default:
        return commonFields;
    }
  };

  const {
    register,
    handleSubmit: handleValidation,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(getSchemaForType()),
    defaultValues: getDefaultValues(),
  });

  const current = watch("current");

  // Function to get the appropriate field labels based on type
  const getFieldLabels = () => {
    switch (type.toLowerCase()) {
      case "education":
        return {
          title: "Degree/Certification",
          organization: "School/University",
          secondaryLabel: "GPA/Grade",
        };
      case "project":
        return {
          title: "Project Name",
          organization: "Client/Organization (Optional)",
          secondaryLabel: "Technologies Used",
        };
      case "experience":
      default:
        return {
          title: "Title/Position",
          organization: "Company/Organization",
          secondaryLabel: "",
        };
    }
  };

  const fieldLabels = getFieldLabels();

  const handleAdd = handleValidation((data) => {
    const formattedEntry = {
      ...data,
      startDate: formatDisplayDate(data.startDate),
      endDate: data.current ? "Present" : formatDisplayDate(data.endDate),
    };

    onChange([...entries, formattedEntry]);

    reset();
    setIsAdding(false);
  });

  const handleDelete = (index) => {
    const newEntries = entries.filter((_, i) => i !== index);
    onChange(newEntries);
  };

  const {
    loading: isImproving,
    fn: improveWithAIFn,
    data: improvedContent,
    error: improveError,
  } = useFetch(improveWithAI);

  useEffect(() => {
    if (improvedContent && !isImproving) {
      setValue("description", improvedContent);
      toast.success("Description improved successfully!");
    }
    if (improveError) {
      toast.error(improveError.message || "Failed to improve description");
    }
  }, [improvedContent, improveError, isImproving, setValue]);

  const handleImproveDescription = async () => {
    const description = watch("description");
    if (!description) {
      toast.error("Please enter a description first");
      return;
    }

    await improveWithAIFn({
      current: description,
      type: type.toLowerCase(), // 'experience', 'education', or 'project'
    });
  };

  // Render the display card for each entry
  const renderEntryCard = (item, index) => {
    // Common date display
    const dateDisplay = item.current
      ? `${item.startDate} - Present`
      : `${item.startDate} - ${item.endDate}`;

    // Custom content based on entry type
    let secondaryInfo = null;
    
    switch (type.toLowerCase()) {
      case "education":
        secondaryInfo = item.gpa ? (
          <p className="text-sm text-muted-foreground mt-1">GPA: {item.gpa}</p>
        ) : null;
        break;
      case "project":
        secondaryInfo = item.technologies ? (
          <p className="text-sm text-muted-foreground mt-1">
            Technologies: {item.technologies}
          </p>
        ) : null;
        break;
    }

    // Render URL for projects if available
    const projectUrl = type.toLowerCase() === "project" && item.projectUrl ? (
      <p className="text-sm text-blue-500 hover:underline mt-1">
        <a href={item.projectUrl} target="_blank" rel="noopener noreferrer">
          {item.projectUrl}
        </a>
      </p>
    ) : null;

    return (
      <Card key={index}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {item.title}
            {item.organization ? ` @ ${item.organization}` : ""}
          </CardTitle>
          <Button
            variant="outline"
            size="icon"
            type="button"
            onClick={() => handleDelete(index)}
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{dateDisplay}</p>
          {secondaryInfo}
          {projectUrl}
          <p className="mt-2 text-sm whitespace-pre-wrap">{item.description}</p>
        </CardContent>
      </Card>
    );
  };

  // Render additional fields based on entry type
  const renderAdditionalFields = () => {
    switch (type.toLowerCase()) {
      case "education":
        return (
          <div className="space-y-2">
            <Input
              placeholder="GPA/Grade (Optional)"
              {...register("gpa")}
              error={errors.gpa}
            />
            {errors.gpa && (
              <p className="text-sm text-red-500">{errors.gpa.message}</p>
            )}
          </div>
        );
      case "project":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Input
                placeholder="Project URL (Optional)"
                {...register("projectUrl")}
                error={errors.projectUrl}
              />
              {errors.projectUrl && (
                <p className="text-sm text-red-500">{errors.projectUrl.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Input
                placeholder="Technologies Used (e.g., React, Node.js, MongoDB)"
                {...register("technologies")}
                error={errors.technologies}
              />
              {errors.technologies && (
                <p className="text-sm text-red-500">{errors.technologies.message}</p>
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        {entries.map((item, index) => renderEntryCard(item, index))}
      </div>

      {isAdding && (
        <Card>
          <CardHeader>
            <CardTitle>Add {type}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Input
                  placeholder={fieldLabels.title}
                  {...register("title")}
                  error={errors.title}
                />
                {errors.title && (
                  <p className="text-sm text-red-500">{errors.title.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Input
                  placeholder={fieldLabels.organization}
                  {...register("organization")}
                  error={errors.organization}
                />
                {errors.organization && (
                  <p className="text-sm text-red-500">
                    {errors.organization.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Input
                  type="month"
                  {...register("startDate")}
                  error={errors.startDate}
                />
                {errors.startDate && (
                  <p className="text-sm text-red-500">
                    {errors.startDate.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Input
                  type="month"
                  {...register("endDate")}
                  disabled={current}
                  error={errors.endDate}
                />
                {errors.endDate && (
                  <p className="text-sm text-red-500">
                    {errors.endDate.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="current"
                {...register("current")}
                onChange={(e) => {
                  setValue("current", e.target.checked);
                  if (e.target.checked) {
                    setValue("endDate", "");
                  }
                }}
              />
              <label htmlFor="current">
                {type.toLowerCase() === "experience" 
                  ? "Current Position" 
                  : type.toLowerCase() === "education" 
                    ? "Currently Studying" 
                    : "Ongoing Project"}
              </label>
            </div>

            {/* Additional fields based on entry type */}
            {renderAdditionalFields()}

            <div className="space-y-2">
              <Textarea
                placeholder={`Description of your ${type.toLowerCase()}`}
                className="h-32"
                {...register("description")}
                error={errors.description}
              />
              {errors.description && (
                <p className="text-sm text-red-500">
                  {errors.description.message}
                </p>
              )}
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleImproveDescription}
              disabled={isImproving || !watch("description")}
            >
              {isImproving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Improving...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Improve with AI
                </>
              )}
            </Button>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset();
                setIsAdding(false);
              }}
            >
              Cancel
            </Button>
            <Button type="button" onClick={handleAdd}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Entry
            </Button>
          </CardFooter>
        </Card>
      )}

      {!isAdding && (
        <Button
          className="w-full"
          variant="outline"
          onClick={() => setIsAdding(true)}
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add {type}
        </Button>
      )}
    </div>
  );
}