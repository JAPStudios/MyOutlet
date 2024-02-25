# authentication.py

import requests

def authenticate_user(api_key):
    """
    Authenticates the user using their API key.
    
    Args:
        api_key (str): The API key of the user.
    
    Returns:
        str: The session ID if authentication is successful, None otherwise.
    """
    # Make a request to the authentication endpoint
    response = requests.post('https://chat.openai.com', data={'api_key': api_key})
    
    # Check if the request was successful
    if response.status_code == 200:
        return response.json().get('session_id')
    else:
        return None

def fetch_user_data(session_id):
    """
    Fetches user data using the provided session ID.
    
    Args:
        session_id (str): The session ID of the authenticated user.
    
    Returns:
        dict: User data if the request is successful, None otherwise.
    """
    # Make a request to the user data endpoint
    response = requests.get(f'https://chat.openai.com={session_id}')
    
    # Check if the request was successful
    if response.status_code == 200:
        return response.json().get('user_data')
    else:
        return None