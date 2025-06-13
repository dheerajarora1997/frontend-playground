"use client";
import { useEffect, useState } from "react";
import "../style.scss";
import { useParams } from "next/navigation";

export default function SingleRecipe() {
  const apiKey = process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY || "";
  const apiUrl =
    process.env.NEXT_PUBLIC_SPOONACULAR_API_URL ||
    "https://api.spoonacular.com/recipes/";
  const { id } = useParams();
  const deviceWidth: number = window !== undefined ? window.innerWidth : 0;
  interface Ingredient {
    nameClean: string;
    amount: number;
    unit: string;
    originalName: string;
    meta: string[];
  }

  interface Step {
    number: number;
    step: string;
    ingredients: { name: string }[];
    equipment: { name: string }[];
  }

  interface Instruction {
    name: string;
    steps: Step[];
  }

  interface Recipe {
    image?: string;
    title?: string;
    readyInMinutes?: number;
    servings?: number;
    summary: string;
    extendedIngredients?: Ingredient[];
    analyzedInstructions?: Instruction[];
    [key: string]:
      | string
      | number
      | boolean
      | Ingredient[]
      | Instruction[]
      | undefined;
  }

  const [singleRecipe, setSingleRecipe] = useState<Recipe>({
    summary: "",
  });
  const [printList, setPrintList] = useState<string[]>([]);
  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await fetch(
          `${apiUrl}${id}/information?apiKey=${apiKey}&includeNutrition=false`
        );
        if ([401, 402].includes(res.status)) {
          alert("Daily points limit of 150 has been reached.");
        }
        if (!res.ok) throw new Error("Network response was not ok");
        const data = await res.json();
        setSingleRecipe(data);
      } catch (error) {
        console.error("Error fetching recipe:", error);
      }
    };
    fetchRecipe();
  }, []);
  useEffect(() => {
    const sampleList: string[] = [];
    Object.entries(singleRecipe).forEach(([key, value]) => {
      if (value === true) {
        sampleList.push(key);
      }
    });
    setPrintList(sampleList);
  }, [singleRecipe]);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    setPosition({
      x: e.clientX,
      y: e.clientY,
    });
  };
  return (
    <>
      <div
        className="single-recipe-wrapper bg-white"
        onMouseMove={handleMouseMove}
      >
        <div
          className="recipe-overlay"
          style={{
            maxHeight: "540px",
            backgroundImage: `url(${singleRecipe?.image})`,
            backgroundPositionX: `${deviceWidth - position.x / 40}px`,
          }}
        ></div>
        <div className="container py-5">
          <div className="row justify-content-center align-items-center">
            <div className="col-sm-12 col-md-5">
              <div className="single-recipe-image">
                <img
                  src={singleRecipe.image}
                  alt={singleRecipe.title}
                  className="img-fluid rounded shadow-lg"
                />
              </div>
            </div>
            <div className="col-sm-12 col-md-7">
              <h1 className="display-6 my-3">{singleRecipe.title}</h1>
              <p className="text-muted d-flex align-items-center">
                <span className="display-6 bg-white bg-opacity-75 px-3 py-2 mx-2 rounded shadow-sm">
                  {singleRecipe.readyInMinutes}
                </span>
                minutes | Servings
                <span className="display-6 bg-white bg-opacity-75 px-3 py-2 mx-2 rounded shadow-sm">
                  {singleRecipe.servings}
                </span>
              </p>
              {printList.length &&
                printList?.map((listItem, index) => {
                  return (
                    <span
                      className="badge bg-secondary text-white m-1 text-uppercase fw-normal"
                      key={index}
                    >
                      {listItem}
                    </span>
                  );
                })}
              <p
                className="disable-anchor"
                dangerouslySetInnerHTML={{ __html: singleRecipe.summary }}
              ></p>
            </div>
          </div>
        </div>
      </div>
      <div className="recipe-ingredients bg-secondary bg-opacity-10 py-5">
        <div className="container py-2">
          <h4 className="h2 mb-4 fw-normal">Ingredients</h4>
          <div className="row">
            {singleRecipe?.extendedIngredients?.map((ingredients, index) => {
              return (
                <div
                  className="ingredient-item bg-white col-6 col-sm-3 p-4 border text-center d-flex flex-column justify-content-center align-items-center"
                  key={index}
                >
                  <h5 className="text-capitalize">{ingredients.nameClean}</h5>
                  <p className="text-muted">
                    {ingredients.amount} {ingredients.unit} -{" "}
                    {ingredients.originalName}
                  </p>
                  <p className="text-muted d-none">
                    {ingredients.meta.join(", ")}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="analyzedInstructions py-5 bg-white">
        <div className="container">
          <h4 className="h2 mb-4 fw-normal">Instructions</h4>
          {singleRecipe?.analyzedInstructions?.map((instruction, index) => {
            return (
              <div className="instruction-item mb-4" key={index}>
                <h5 className="text-capitalize">{instruction.name}</h5>
                <div className="row">
                  {instruction.steps.map((step, stepIndex) => {
                    return (
                      <div
                        className="col-12 col-sm-12 col-md-6 "
                        key={stepIndex}
                      >
                        <div
                          className="step-item bg-secondary bg-opacity-10 mb-2"
                          data-step={step.number}
                        >
                          <p className="fw-bold">{step.step}</p>
                          <p className="text-muted">
                            Ingredients:{" "}
                            {step.ingredients
                              .map((ing) => ing?.name)
                              .join(", ")}
                          </p>
                          {step.equipment.length > 0 && (
                            <p className="text-muted">
                              Equipment:{" "}
                              {step.equipment
                                .map((equip) => equip.name)
                                .join(", ")}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
