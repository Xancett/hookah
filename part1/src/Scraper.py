from requests import get
from requests.exceptions import RequestException
from contextlib import closing
from bs4 import BeautifulSoup

# Function to get the URL content
def simple_get(url):
	# try to open the url
	try:
		with closing(get(url, stream=True)) as resp:
			return resp.content
	# Return none if error
	except RequestException as e:
		log_error('Error during request')
		return none

