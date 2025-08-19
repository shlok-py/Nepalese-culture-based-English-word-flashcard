from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow

SCOPES = ['https://www.googleapis.com/auth/youtube.force-ssl']




# request = youtube.channels().list(
#     part = 'statistics',
#     forUsername = 'schafer5'

# )

# response = request.execute()
# print(response)
flow =InstalledAppFlow.from_client_secrets_file('client_secret.json', SCOPES)
credentials =flow.run_local_server()
youtube = build('youtube', 'v3', credentials=credentials)
request = youtube.captions().list(
    part="id,snippet",
   videoId = 'mvVBuG4IOW4'
)

response = request.execute()

print(response)