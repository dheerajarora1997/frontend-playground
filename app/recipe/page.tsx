"use client";

import { useState, useEffect, useCallback } from "react";
import "./style.scss";
import Link from "next/link";

interface Recipe {
  id: number;
  title: string;
  image: string;
}

export default function Recipe() {
  const apiKey = process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY || "";
  const apiUrl =
    process.env.NEXT_PUBLIC_SPOONACULAR_API_URL ||
    "https://api.spoonacular.com/recipes/";
  const [recipeList, setRecipeList] = useState<Recipe[]>([]);
  const [recipeSearchList, setRecipeSearchList] = useState<Recipe[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [noResult, setNoResult] = useState("");

  // Use useCallback to memoize fetchRecipes
  const fetchRecipes = useCallback(
    async (query: string) => {
      try {
        const response = await fetch(
          `${apiUrl}complexSearch?apiKey=${apiKey}${
            query ? `&query=${encodeURIComponent(query)}` : ""
          }`
        );
        if ([401, 402].includes(response.status)) {
          alert("Daily points limit of 150 has been reached.");
        }
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        if (query) {
          setRecipeSearchList(data.results || []);
          if (data.results?.length === 0) {
            setNoResult("No results found for your search.");
          } else {
            setNoResult("");
          }
        } else {
          setRecipeList(data.results || []);
          setRecipeSearchList([]);
        }
      } catch (error) {
        // Optionally handle error (e.g., show toast)
        console.error("Failed to fetch recipes:", error);
        setRecipeSearchList([]);
      }
    },
    [apiKey, apiUrl]
  );

  useEffect(() => {
    fetchRecipes("");
  }, [fetchRecipes]);

  // Debounced search (optional, for better UX)
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchValue.trim()) {
        fetchRecipes(searchValue.trim());
      }
    }, 500);
    return () => clearTimeout(handler);
  }, [searchValue, fetchRecipes]);

  return (
    <div className="recipe-container bg-white">
      <div className="search-wrapper p-5 text-center">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-11 col-md-7 col-lg-5">
            <div className="form-group">
              <input
                type="text"
                className="form-control rounded-5 py-3 px-4"
                placeholder="Search for Dish Name, Cuisine, or Ingredients"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
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
        <div className="py-4">
          <div className="container">
            <h6 className="fw-normal">Search Results</h6>
            <div className="row">
              {recipeSearchList.map((recipe) => (
                <Link
                  href={`/recipe/${recipe.id.toString()}`}
                  className="col-12 col-md-6 col-lg-4 col-xl-3"
                  key={recipe.id}
                >
                  <div className="search-recipe-wrapper bg-secondary bg-opacity-10 p-3 mb-3 rounded">
                    <div className="row justify-content-between align-items-center">
                      <div className="col-8">
                        <h2 className="h6">
                          {recipe.title.length > 40
                            ? recipe.title.substring(0, 40) + "..."
                            : recipe.title}
                        </h2>
                      </div>
                      <div className="col-4">
                        {recipe.image && (
                          <img
                            src={recipe.image}
                            alt={recipe.title}
                            className="img-fluid rounded"
                            style={{ objectFit: "cover" }}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
      {noResult && (
        <div className="container text-center my-5">
          <h2 className="alert bg-danger bg-opacity-10 h4 rounded-5 text-danger">
            {noResult}
          </h2>
        </div>
      )}
      <div className="wrapper">
        <div className="container">
          <h1 className="display-6 my-3">Recipe List</h1>
          <div className="row mt-5">
            {recipeList.map((recipe) => (
              <Link
                href={`/recipe/${recipe.id.toString()}`}
                className="col-12 col-md-6 col-lg-4 col-xl-3"
                key={recipe.id}
              >
                <div className="recipe-wrapper bg-secondary bg-opacity-10">
                  {recipe.image && (
                    <img
                      src={recipe.image}
                      alt={recipe.title}
                      className="img-fluid"
                    />
                  )}
                  <h2 className="h6">
                    {recipe.title.length > 40
                      ? recipe.title.substring(0, 40) + "..."
                      : recipe.title}
                  </h2>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
