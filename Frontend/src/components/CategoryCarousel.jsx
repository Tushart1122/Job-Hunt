import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import { Button } from "./ui/button";
import { setSearchedQuery } from "@/redux/jobSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

const categories = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Data Scientist",
  "Software Development Engineer (SDE)",
  "UI/UX Designer",
  "Graphic Designer",
  "Mobile App Developer",
  "DevOps Engineer",
  "Product Manager",
  "QA / Test Engineer",
  "Cloud Engineer",
];

const CategoryCarousel = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const searchJobHandler = (query) => {
    dispatch(setSearchedQuery(query));
    navigate(`/browse?query=${encodeURIComponent(query)}`);
  };

  return (
    <div className="my-20">
      <h2 className="text-2xl font-bold text-center mb-6">
        🔥 Popular Categories
      </h2>
      <Carousel className="w-full max-w-4xl mx-auto">
        <CarouselContent>
          {categories.map((item, index) => (
            <CarouselItem
              key={index}
              className="md:basis-1/2 lg:basis-1/3 flex justify-center"
            >
              <div className="p-2">
                <Button
                  onClick={() => searchJobHandler(item)}
                  variant="outline"
                  className="rounded-full px-6 py-3 text-lg hover:bg-[#6A38C2] hover:text-white transition-all"
                >
                  {item}
                </Button>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};

export default CategoryCarousel;
