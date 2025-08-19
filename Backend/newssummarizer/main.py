import logging
import time
from datetime import datetime
import requests
import openai
import os
import json
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from dotenv import find_dotenv, load_dotenv

load_dotenv()


app = FastAPI()

class NewsrequestModel(BaseModel):
    title: str
    max_words : int = 100

news_api_key = os.environ.get("NEWS_API_KEY")

client = openai.OpenAI()
model = 'gpt-3.5-turbo'




def get_news(topic):
     url = (
          f"https://newsapi.org/v2/everything?q={topic}&apiKey={news_api_key}&pageSize=5"
     )

     try:
           response= requests.get(url)
           if response.status_code == 200:
            news = json.dumps(response.json(), indent=4)
            news_json = json.loads(news)

            data = news_json

            # ACCESS ALL THE FIELDS == LOOP THROUGH
            status = data["status"]
            total_results = data["totalResults"]
            articles = data["articles"]
            final_news = []

            # LOOP THROUGH ARTICLES  
            for article in articles:
                source_name = article["source"]["name"]
                author = article["author"]
                title = article["title"]
                description = article["description"]
                url = article["url"]
                content = article["content"]

                title_description = f""" 
                   Title:{title},
                   Author:{author},
                   Source :{source_name},
                   Description :{description},
                   URL : {url}
                   """
                final_news.append(title_description)
                return final_news
            else:
                return []

     except requests.exceptions.RequestException as e:
        print("Error occured during api request")


@app.post("/summarize-news/")

def news_summarize(request:NewsrequestModel):
    news_list = get_news(request.title)

    if not news_list:
        raise HTTPException(status_code=404, detail="No news article is found")
    combined_news = "\n\n".join(news_list)


    try:
        response = openai.chat.completions.create(
            model = model,
            messages=[{
                "role": "system", "content": "You are competent assistant who know how to summarize the news"},
                { "roles":"user", "content":f"summarize the  following news articles in {request.max_words} words:\n\n{combined_news}"}
               
            ],

        )
        summary = response["choices"][0]["messages"]["content"].strip()
        return {"topic": request.topic, "summary":summary}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))