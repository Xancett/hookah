from requests import get
from requests.exceptions import RequestException
from contextlib import closing
from bs4 import BeautifulSoup

url_list = [
	'https://www.hookah-shisha.com/p-4246-starbuzz-hookah-tobacco-flavors-100.html'
]

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

# Function to get a list of all flavors
def GetFlavors(request):
	for i, li in enumerate(request.select('option')):
		print(li.text)

# Main
for url in url_list:
	pageRequest = simple_get(url)
	page = BeautifulSoup(pageRequest, 'html.parser')
	GetFlavors(page)
