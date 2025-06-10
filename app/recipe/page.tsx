"use client";

import { useState, useEffect } from "react";
import "./style.scss";

interface Recipe {
  id: number;
  title: string;
  image: string;
}

export default function Recipe() {
  const apiKey = "bfc80484d88a4ca8a64482e062989d52";
  const apiUrl = "https://api.spoonacular.com/recipes/";
  const [recipeList, setRecipeList] = useState([]);
  const [recipeSearchList, setRecipeSearchList] = useState([]);
  const fetchRecipes = async (query: string) => {
    console.log("Fetching recipes for:", query);
    const response = await fetch(
      `${apiUrl}complexSearch?apiKey=${apiKey}${query ? `&query=${query}` : ""}`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    if (query) {
      setRecipeSearchList(data.results || []);
    } else {
      setRecipeList(data.results || []);
      setRecipeSearchList([]);
    }
  };
  useEffect(() => {
    fetchRecipes("");
  }, []);
  return (
    <>
      <div className="recipe-container bg-white">
        <div className="search-wrapper p-5 text-center">
          <div className="row justify-content-center">
            <div className="col-12 col-sm-11 col-md-7 col-lg-5">
              <div className="form-group">
                <input
                  type="text"
                  className="form-control rounded-5 py-3 px-4"
                  placeholder="Search for Dish Name, Cuisine, or Ingredients"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      fetchRecipes((e.target as HTMLInputElement).value);
                    }
                  }}
                />
              </div>
              <h1 className="display-6 fw-bold mt-4 mb-2">Explore Recipe</h1>
              <p className="text-center">
                Discover a world of culinary delights with our extensive recipe
                collection. Whether you&apos;re looking for quick meals, healthy
                options, or gourmet dishes, we have something for every taste.
                <br />
                Start your cooking adventure today!
              </p>
            </div>
          </div>
        </div>
        {recipeSearchList.length > 0 && (
          <>
            <div className=" py-4">
              <div className="container">
                <h6 className="fw-normal">Search Results</h6>
                <div className="row">
                  {recipeSearchList.map((recipe: Recipe, index: number) => (
                    <div
                      className="col-12 col-md-6 col-lg-4 col-xl-3"
                      key={index}
                    >
                      <div className="search-recipe-wrapper bg-secondary bg-opacity-10 p-3 mb-3">
                        <div className="row justify-content-between align-items-center">
                          <div className="col-8">
                            <h2 className="h6">
                              {recipe?.title?.length > 40
                                ? recipe?.title.substring(0, 40) + "..."
                                : recipe?.title}
                            </h2>
                          </div>
                          <div className="col-4">
                            {recipe?.image && (
                              <img
                                src={recipe?.image}
                                alt={recipe?.title}
                                className="img-fluid rounded"
                                style={{ objectFit: "cover" }}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
        <div className="wrapper">
          <div className="container">
            <h1 className="display-6 my-3">Recipe List</h1>
            <div className="row mt-5">
              {recipeList.map((recipe: Recipe, index: number) => (
                <div className="col-12 col-md-6 col-lg-4 col-xl-3" key={index}>
                  <div className="recipe-wrapper bg-secondary bg-opacity-10">
                    {recipe?.image && (
                      <img
                        src={recipe?.image}
                        alt={recipe?.title}
                        className="img-fluid"
                      />
                    )}
                    <h2 className="h6">
                      {recipe?.title?.length > 40
                        ? recipe?.title.substring(0, 40) + "..."
                        : recipe?.title}
                    </h2>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
