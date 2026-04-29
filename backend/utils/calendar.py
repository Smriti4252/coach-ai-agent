import os
import datetime
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from googleapiclient.discovery import build

SCOPES = ['https://www.googleapis.com/auth/calendar']
CREDENTIALS_FILE = os.path.join(os.path.dirname(__file__), '..', 'credentials.json')
TOKEN_FILE = os.path.join(os.path.dirname(__file__), '..', 'token.json')


def get_calendar_service():
    creds = None

    # load existing token if available
    if os.path.exists(TOKEN_FILE):
        creds = Credentials.from_authorized_user_file(TOKEN_FILE, SCOPES)

    # if no valid token, login via browser
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(CREDENTIALS_FILE, SCOPES)
            creds = flow.run_local_server(port=0)

        # save token for next time
        with open(TOKEN_FILE, 'w') as f:
            f.write(creds.to_json())

    service = build('calendar', 'v3', credentials=creds)
    return service


def get_free_slots() -> list:
    service = get_calendar_service()
    now = datetime.datetime.utcnow()
    slots = []

    for i in range(1, 6):
        day = now + datetime.timedelta(days=i)

        # skip weekends
        if day.weekday() >= 5:
            continue

        # check 10am slot
        start = day.replace(hour=10, minute=0, second=0, microsecond=0)
        end = start + datetime.timedelta(hours=1)

        # check if slot is free using freebusy query
        body = {
            "timeMin": start.isoformat() + 'Z',
            "timeMax": end.isoformat() + 'Z',
            "items": [{"id": "primary"}]
        }

        result = service.freebusy().query(body=body).execute()
        busy = result['calendars']['primary']['busy']

        if not busy:
            slots.append(start.strftime("%A, %B %d at %I:%M %p"))

        if len(slots) == 3:
            break

    return slots


def book_slot(name: str, email: str, slot_str: str) -> dict:
    service = get_calendar_service()

    # parse slot string back to datetime
    slot_dt = datetime.datetime.strptime(slot_str, "%A, %B %d at %I:%M %p")
    now = datetime.datetime.utcnow()
    slot_dt = slot_dt.replace(year=now.year)
    end_dt = slot_dt + datetime.timedelta(hours=1)

    event = {
        'summary': f'Discovery Call — {name}',
        'description': f'Coaching discovery call with {name} ({email})',
        'start': {
            'dateTime': slot_dt.isoformat(),
            'timeZone': 'UTC'
        },
        'end': {
            'dateTime': end_dt.isoformat(),
            'timeZone': 'UTC'
        },
        'attendees': [
            {'email': email}
        ],
        'reminders': {
            'useDefault': False,
            'overrides': [
                {'method': 'email', 'minutes': 60},
                {'method': 'popup', 'minutes': 15}
            ]
        }
    }

    created = service.events().insert(
        calendarId='primary',
        body=event,
        sendUpdates='all'
    ).execute()

    return {
        'event_id': created.get('id'),
        'event_link': created.get('htmlLink')
    }