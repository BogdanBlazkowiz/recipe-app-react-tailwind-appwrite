import { useState, useEffect } from "react";
import { useUser } from "../lib/context/user";
import { useRecipes } from "../lib/context/recipes";

export function Home() {
    const user = useUser();
    const Recipes = useRecipes();

    const [isCreating, setIsCreating] = useState(false)
    const [modalIsOpen, setModalIsOpen] = useState(false)
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [preview, setPreview] = useState();
    const [recipePicture, setRecipePicture] = useState();
    const [ingredientInputs, setIngredientInputs] = useState([["", "", ""]])
    const [modalInfo, setModalInfo] = useState({ title: "", desc: "", newIngredients: [], picture: null, multiplier: 1 })

    const addIngredient = () => {
        setIngredientInputs([...ingredientInputs, ["", "", ""]])
    }

    const updateIngredient = (event) => {
        let targetInput = event.target
        let id = targetInput.id
        let splitId = id.split("-");
        let newInputs = JSON.parse(JSON.stringify(ingredientInputs))
        if (splitId[1] === "name") {
            newInputs[parseInt(splitId[2])][0] = targetInput.value
            setIngredientInputs(newInputs)
        }
        if (splitId[1] === "amount") {
            newInputs[parseInt(splitId[2])][1] = targetInput.value
            setIngredientInputs(newInputs)

        }
        if (splitId[1] === "unit") {
            newInputs[parseInt(splitId[2])][2] = targetInput.value
            setIngredientInputs(newInputs)
        }
    }

    const deleteIngredient = (event) => {
        let targetInput = event.target
        let id = targetInput.id
        let splitId = id.split("-");
        let newInputs = JSON.parse(JSON.stringify(ingredientInputs))
        console.log(splitId[2])
        newInputs.splice(splitId[2], 1);
        setIngredientInputs(newInputs)
    }
    useEffect(() => {
        if (!recipePicture) {
            setPreview(undefined)
            return
        }
        // create the preview
        const objectUrl = URL.createObjectURL(recipePicture)
        setPreview(objectUrl)
        // free memory when ever this component is unmounted
        return () => URL.revokeObjectURL(objectUrl)
    }, [recipePicture])

    const changeCreating = () => {
        setIsCreating(!isCreating)
    }

    const openModal = (evt) => {
        let clickedCard = evt.target.parentElement.parentElement
        let title = clickedCard.querySelector(".recipe-title-card").innerText;
        let desc = clickedCard.querySelector(".recipe-desc-card").innerText;
        let ingredients = clickedCard.querySelector(".recipe-ingredients-card").children;
        let picture = clickedCard.querySelector(".recipe-picture-card").src;
        let newIngredients = []
        // casts htmlcollection to array
        ingredients = Array.prototype.slice.call(ingredients)
        ingredients.map((elem) => {
            newIngredients.push(elem.dataset.storage)
            return ("success")
        })
        setModalInfo({ title, desc, newIngredients, picture, multiplier: 1 })
        setModalIsOpen(true)
    }

    const closeModal = (evt) => {
        setModalIsOpen(false)
    }

    const addToMultiplier = () => {
        let currentInfo = modalInfo;
        let newInfo = { title: currentInfo["title"], desc: currentInfo["desc"], newIngredients: currentInfo["newIngredients"], picture: currentInfo["picture"], multiplier: parseInt(currentInfo["multiplier"]) + 1 }
        setModalInfo(newInfo)
    }
    const removeFromMultiplier = () => {
        let currentInfo = modalInfo;
        let newInfo
        if (parseInt(currentInfo["multiplier"]) - 1 < 1) {
            newInfo = currentInfo
        }
        else {
            newInfo = { title: currentInfo["title"], desc: currentInfo["desc"], newIngredients: currentInfo["newIngredients"], picture: currentInfo["picture"], multiplier: parseInt(currentInfo["multiplier"]) - 1 }
        }
        setModalInfo(newInfo)
    }
    return (
        <>
            {/* Show the submit form to logged in users. */}
            {user.current ? (
                <section className={isCreating ? "opacity-100 transition-opacity pt-5" : "opacity-0 -z-10 absolute transition-opacity pt-5"}>
                    <div className="create-recipe rounded-3xl bg-rose-800 flex flex-col items-center p-5 gap-2"
                    >
                        <div className="flex flex-row w-full">
                            <button className="col-span-1 text-zinc-50 bg-red-600 rounded-2xl p-2 w-fit border-red-600 hover:opacity-70 hover:border-solid hover:border-black" onClick={changeCreating}>Stop adding</button>
                        </div>
                        <h2 className="col-span-1 text-zinc-50 bg-blue-700 rounded-2xl p-2 w-fit">New Recipe</h2>
                        <form className="flex flex-col items-center w-full gap-2" onSubmit={async (evt) => {
                            evt.preventDefault();
                            await Recipes.add({
                                userId: user.current.$id, "recipe-title": title, "recipe-desc": description, recipePicture, "recipe-ingredients": ingredientInputs.reduce((acc, subArray) => {
                                    const concatenatedString = subArray.join('-');
                                    acc.push(concatenatedString);
                                    return acc;
                                }, [])
                            })
                            setIngredientInputs([["", "", ""]])
                            setTitle("")
                            setDescription("")
                            setRecipePicture()
                            changeCreating();
                        }}>
                            <div className="flex flex-col justify-between items-center w-1/2 gap-5">
                                <div className="flex items-center w-full justify-between gap-10">
                                    <label className="w-40" htmlFor="title">Title:</label>
                                    <input
                                        className="w-full rounded-2xl p-2"
                                        type="text"
                                        placeholder="Title"
                                        name="title"
                                        required
                                        value={title}
                                        onChange={(event) => {
                                            setTitle(event.target.value);
                                        }}
                                    />
                                </div>
                                <div className="flex items-center w-full justify-between gap-10">
                                    <label className="w-40" htmlFor="desc">Description:</label>
                                    <textarea
                                        className="w-full h-32 rounded-2xl p-2"
                                        placeholder="Description"
                                        name="desc"
                                        required
                                        value={description}
                                        onChange={(event) => {
                                            setDescription(event.target.value);
                                        }}
                                    />
                                </div>
                                <div className=" h-60 flex items-center w-full gap-10">
                                    <label className="w-40" htmlFor="recipe-picture">Picture for the recipe:</label>
                                    <div className="flex flex-col gap-2 items-center justify-center w-80 h-60">
                                        <input
                                            className="rounded-2xl p-2"
                                            type="file"
                                            id="uploader"
                                            required
                                            onChange={(event) => {
                                                setRecipePicture(event.target.files[0]);
                                            }}
                                        />
                                        <img className="w-56 h-40 object-cover" src={preview} alt="preview"></img>
                                    </div>
                                </div>
                            </div>
                            <div className="col-start-1 col-end-3 row-start-2 row-end-2 flex items-center w-auto">
                                <div className="col-start-1 col-end-3 row-start-2 row-end-2 w-full flex flex-col items-center gap-2">
                                    <button type="button" className="bg-slate-400 p-1 rounded-2xl" onClick={addIngredient}>Add Ingredient</button>
                                    {ingredientInputs.map((elem, index) => {
                                        return <div className="flex items-center gap-2" key={index}>

                                            <label className="w-40" htmlFor={"ingredient-" + index}>{"Ingredient " + index + ":"}</label>
                                            <input
                                                className="w-60 rounded-md p-2"
                                                type="text"
                                                placeholder="Ingredient"
                                                required
                                                name={"ingredient-" + index}
                                                id={"ingredient-name-" + index}
                                                value={ingredientInputs[index][0]}
                                                onChange={updateIngredient}
                                            />
                                            <input
                                                className="w-20 rounded-md p-2"
                                                type="text"
                                                placeholder="Amount"
                                                required
                                                name={"ingredient-" + index}
                                                id={"ingredient-amount-" + index}
                                                value={ingredientInputs[index][1]}
                                                onChange={updateIngredient}
                                            />
                                            <input
                                                className="w-20 rounded-md p-2"
                                                type="text"
                                                placeholder="Unit"
                                                required
                                                name={"ingredient-" + index}
                                                id={"ingredient-unit-" + index}
                                                value={ingredientInputs[index][2]}
                                                onChange={updateIngredient}
                                            />
                                            <button className="w-40 text-red-600 bg-black border-2 rounded-2xl p-1 border-solid border-black" type="button" id={"ingredient-delete-" + index} onClick={deleteIngredient}>Delete Ingredient</button>
                                        </div>
                                    })}
                                </div>
                            </div>
                            <button
                                className="bg-slate-400 rounded-2xl p-2 hover:bg-slate-300 border border-slate-400 hover:border-solid hover:border-black"
                                type="submit"
                            >
                                Submit
                            </button>
                        </form>
                    </div>
                </section>
            ) : (
                <section>
                    <p>Please login to submit a recipe.</p>
                </section>
            )}
            <button type="button" hidden={isCreating} onClick={changeCreating} className="bg-slate-400 rounded-2xl p-2 hover:bg-slate-300 border border-slate-400 hover:border-solid hover:border-black">Add new recipe</button>
            <li className={(modalIsOpen ? "opacity-100 transition-opacity fixed bottom-1/4" : "opacity-0 -z-10 fixed transition-opacity") + ' bg-blue-500 p-5 rounded-2xl flex flex-row justify-between items-start h-4/6 gap-2 w-11/12 border border-solid border-black'} >
                <div className="flex flex-col gap-10">
                    <strong className="recipe-title-card w-28">{modalInfo["title"]}</strong>
                    <div className="picture-container w-28  h-28">
                        <img className="recipe-picture-card object-cover  w-full  h-full rounded-2xl recipe-picture" alt="recipe" src={modalInfo["picture"]}></img>
                    </div>
                    <div className="flex gap-2 items-center">
                        <button className="border border-solid border-black rounded-full p-1 w-8" onClick={removeFromMultiplier}>-</button>
                        <p>{modalInfo["multiplier"]}</p>
                        <button className="border border-solid border-black rounded-full p-1 w-8" onClick={addToMultiplier}>+</button>
                    </div>
                </div>
                <div className="flex flex-col items-center gap-10">
                    <p className="recipe-desc-card overflow-hidden h-48">{modalInfo["desc"]}</p>
                    <div className="recipe-ingredients-card grid grid-cols-5 gap-2 overflow-hidden h-32">{modalInfo["newIngredients"].map((elem) => {
                        let splitElem = elem.split("-");
                        return <p className="w-40">{splitElem[0] + ", " + parseInt(splitElem[1]) * modalInfo["multiplier"] + " " + splitElem[2]}</p>
                    })}</div>
                </div>
                <div className="flex flex-col-reverse h-full">
                    <button className="w-16 border border-solid border-black rounded-md" type="button" onClick={closeModal}>Close modal</button>
                </div>
            </li>
            <section className="p-20 rounded-2xl bg-cyan-700">
                <h2>Latest Recipes</h2>
                <ul className="grid grid-cols-2 gap-4">
                    {Recipes.current.map((recipe) => (
                        <li className="bg-blue-300 p-5 rounded-2xl flex flex-row justify-between items-start w-full h-72 gap-2" key={recipe.$id}>
                            <div className="flex flex-col gap-10">
                                <strong className="recipe-title-card w-28">{recipe["recipe-title"]}</strong>
                                <div className="picture-container w-28  h-28">
                                    <img className="recipe-picture-card object-cover  w-full  h-full rounded-2xl recipe-picture" alt="recipe" src={recipe["pictureId"]}></img>
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <p className="recipe-desc-card overflow-hidden h-32">{recipe["recipe-desc"]}</p>
                                <div className="recipe-ingredients-card overflow-hidden h-32">{recipe["recipe-ingredients"].map((elem) => {
                                    let splitElem = elem.split("-");
                                    return <p data-storage={elem}>{splitElem[0] + ", " + splitElem[1] + " " + splitElem[2]}</p>
                                })}</div>
                            </div>
                            <div className="flex flex-col-reverse gap-2 h-full">
                                <button className="w-20 border border-solid border-black rounded-md" type="button" onClick={openModal}>Open up</button>
                                {user.current && user.current.$id === recipe.userId && (
                                    <button className=" border border-solid border-black rounded-md" type="button" onClick={() => Recipes.remove(recipe.$id)}>
                                        Remove
                                    </button>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            </section>
        </>
    );
}
