import { createContext, useContext, useEffect, useState } from "react";
import { databases, storageAppWrite } from "../appwrite";
import { ID, Query } from "appwrite";

export const RECIPES_DATABASE_ID = "66c5b0f40031980652bc"; // Replace with your database ID
export const RECIPES_COLLECTION_ID = "66c5b0fc002bc7da6dc4"; // Replace with your collection ID

const RecipesContext = createContext();

export function useRecipes() {
    return useContext(RecipesContext);
}

export function RecipesProvider(props) {
    const [Recipes, setRecipes] = useState([]);

    async function add(recipe) {
        const pictureId = ID.unique()
        // eslint-disable-next-line
        const recipePicturePromise = await storageAppWrite.createFile(
            '66c5b61d0002fe9bd556',
            pictureId,
            recipe.recipePicture
        );
        const pictureLink = storageAppWrite.getFileDownload('66c5b61d0002fe9bd556', pictureId)
        const response = await databases.createDocument(
            RECIPES_DATABASE_ID,
            RECIPES_COLLECTION_ID,
            ID.unique(),
            {userId: recipe.userId, "recipe-title": recipe["recipe-title"], "recipe-desc": recipe["recipe-desc"], "recipe-ingredients": recipe["recipe-ingredients"], pictureId: pictureLink},
        );
        setRecipes((Recipes) => [response, ...Recipes].slice(0, 10));
    }

    async function remove(id) {
        await databases.deleteDocument(RECIPES_DATABASE_ID, RECIPES_COLLECTION_ID, id);
        setRecipes((Recipes) => Recipes.filter((recipe) => recipe.$id !== id));
        await init(); // Refetch Recipes to ensure we have 10 items
    }

    async function init() {
        const response = await databases.listDocuments(
            RECIPES_DATABASE_ID,
            RECIPES_COLLECTION_ID,
            [Query.orderDesc("$createdAt"), Query.limit(10)]
        );
        setRecipes(response.documents);
    }

    useEffect(() => {
        init();
    }, []);

    return (
        <RecipesContext.Provider value={{ current: Recipes, add, remove }}>
            {props.children}
        </RecipesContext.Provider>
    );
}
