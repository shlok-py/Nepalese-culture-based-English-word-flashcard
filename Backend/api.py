from fastapi import FastAPI,Path,HTTPException
from typing import Optional
from data.flashcarddata import flashcards


app = FastAPI()


@app.get('/cards/')

def get_all_cards():
    return flashcards

@app.get('/cards/{flashcard_id}')

def get_all_cards(flashcard_id: int  = Path(description="Card Id")):
    return flashcards[flashcard_id]



@app.get("/words/{word}")

def get_card_by_word(word:str):
    for flashcard_id in flashcards:
        if flashcards[flashcard_id]["word"].lower() == word.lower():
            return flashcards[flashcard_id]
        else:
            raise HTTPException(status_code=404,detail="Card not found")
        

@app.get("/get-card-by-difficulty/")

def get_card_bydifficulty(flashcard_id: int ,difficulty:Optional[str]=None):
    results = []
    if difficulty:
        for  flashcard_id in flashcards:
            if flashcards[flashcard_id]["difficulty"].lower() == difficulty.lower():
                results.append(flashcards[flashcard_id])
                return results
            else:
                return {"Error":"You can do it!"}
